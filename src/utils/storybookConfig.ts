import { parse } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import {
  ImportSpecifier,
  importSpecifier,
  identifier,
  isIdentifier,
  isArrayExpression,
  importDeclaration,
  stringLiteral,
  Program,
  isImportSpecifier,
  ImportDeclaration,
  isCallExpression,
  isObjectExpression,
  isObjectProperty,
  callExpression,
  objectExpression,
  objectProperty, arrayExpression
} from '@babel/types';
import generate from '@babel/generator';

export const storybookPath = '/.storybook';
export const storybookConfigPath = `${storybookPath}/config.js`;

const addDecorator = 'addDecorator';
const moduleMetadata = 'moduleMetadata';
const configure = 'configure';
const declarations = 'declarations';
const storybookAngular = '@storybook/angular';

function importMembers(path: NodePath<ImportDeclaration>, members: string[]): void {
  const imports = path.node.specifiers
    .filter(s => isImportSpecifier(s))
    .map(s => (s as ImportSpecifier).imported.name);
  for (const member of members) {
    if (imports.indexOf(member) < 0) {
      path.node.specifiers.push(importSpecifier(identifier(member), identifier(member)));
    }
  }
}

export function updateStorybookConfig(content: string, componentName: string, componentImportPath: string): string {
  const ast = parse(content, {
    sourceType: 'module'
  });

  let imported = false;
  let declarationsAdded = false;

  traverse(ast, {
    Program: {
      exit(path) {
        if (!imported) {
          (path.node as Program).body.unshift(importDeclaration(
            [importSpecifier(identifier(componentName), identifier(componentName))],
            stringLiteral(componentImportPath)
          ));
        }
      }
    },
    ImportDeclaration(path) {
      switch (path.node.source.value) {
        case storybookAngular:
          importMembers(path, [addDecorator, moduleMetadata]);
          break;
        case componentImportPath:
          imported = true;
          importMembers(path, [componentName]);
          break;
      }
    },
    CallExpression(path) {
      if (declarationsAdded || !isIdentifier(path.node.callee)) {
        return;
      }
      switch (path.node.callee.name) {
        case addDecorator:
          const arg = path.node.arguments[0];
          if (!arg || !isCallExpression(arg) || !isIdentifier(arg.callee) || arg.callee.name !== moduleMetadata) {
            break;
          }
          const metadata = arg.arguments[0];
          if (!metadata || !isObjectExpression(metadata)) {
            break;
          }
          for (const property of metadata.properties) {
            if (
              !isObjectProperty(property) ||
              !isIdentifier(property.key) ||
              property.key.name !== declarations ||
              !isArrayExpression(property.value)
            ) {
              continue;
            }
            declarationsAdded = true;
            if (!property.value.elements.some(e => !!e && isIdentifier(e) && e.name === componentName)) {
              property.value.elements.push(identifier(componentName));
            }
            break;
          }
          break;
        case configure:
          path.insertBefore(callExpression(
            identifier(addDecorator),
            [callExpression(
              identifier(moduleMetadata),
              [objectExpression([
                objectProperty(identifier(declarations), arrayExpression([identifier(componentName)]), false, true)
              ])]
            )]
          ));
          break;
      }
    }
  });
  return generate(ast).code;
}
