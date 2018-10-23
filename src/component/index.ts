import {
  Rule,
  apply,
  chain,
  mergeWith,
  template,
  url,
  externalSchematic,
  move,
  Tree,
} from '@angular-devkit/schematics';
import { Schema } from './schema';
import { strings } from '@angular-devkit/core';
import { parseName } from '@schematics/angular/utility/parse-name';
import { getWorkspace } from '@schematics/angular/utility/config';
import { buildDefaultPath } from '@schematics/angular/utility/project';
import { buildRelativePath } from '@schematics/angular/utility/find-module';

interface ExtendedOptions extends Schema {
  componentDir: string;
  dasherizedName: string;
  classifiedName: string;
  storyNameSpace: string;
  storyDir: string;
}

function buildSelector(name: string, prefix?: string, projectPrefix?: string) {
  let selector = strings.dasherize(name);
  if (prefix) {
    selector = `${prefix}-${selector}`;
  } else if (prefix === undefined && projectPrefix) {
    selector = `${projectPrefix}-${selector}`;
  }
  return selector;
}

function createStory(options: ExtendedOptions): Rule {
  const lastPath = options.tagAsLabel ? `<${options.selector}>` : `${options.classifiedName}Component`;
  return mergeWith(apply(url('./files'), [
    template({
      ...options,
      relativePath: buildRelativePath(
        `${options.storyDir}/${options.dasherizedName}.stories`,
        `${options.componentDir}/${options.dasherizedName}.component`
      ),
      label: `${options.storyNameSpace}/${lastPath}`
    }),
    move(options.storyDir)
  ]));
}

export default function (options: Schema): Rule {
  if (options.noStory) {
    return externalSchematic('@schematics/angular', 'component', options);
  }
  return (host: Tree) => {
    const workspace = getWorkspace(host);
    const project = workspace.projects[options.project!];
    const { path: componentPath, name } = parseName(
      options.path === undefined ? buildDefaultPath(project) : options.path,
      options.name
    );
    const replacePath: { from: string, to: string }[] = JSON.parse(options.replacePath);
    const storyPath = replacePath.reduce(
      (storyPath, { from, to }) => storyPath.replace(new RegExp(from), to),
      options.name
    );
    const dasherizedName = strings.dasherize(name);
    const classifiedName = strings.classify(name);
    const componentDir = options.flat ? componentPath : `${componentPath}/${dasherizedName}`;
    const { path: storyDir } = options.useComponentDir
      ? { path: componentDir }
      : parseName(`/${buildDefaultPath(project)}/../stories`, storyPath);
    const extendedOptions = {
      ...options,
      componentDir,
      storyDir,
      storyNameSpace: storyPath.substr(0, storyPath.lastIndexOf('/')),
      dasherizedName,
      classifiedName,
      selector: options.selector || buildSelector(name, options.prefix, project.prefix)
    };
    return chain([
      externalSchematic('@schematics/angular', 'component', options),
      createStory(extendedOptions)
    ]);
  }
}