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
import {
  storybookConfigPath,
  updateStorybookConfig
} from '../utils/storybookConfig';

interface ExtendedOptions extends Schema {
  componentDir: string;
  dasherizedName: string;
  classifiedName: string;
  selector: string;
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
  return mergeWith(apply(url('./files'), [
    template({
      ...options,
      relativePath: buildRelativePath(
        `${options.storyDir}/${options.dasherizedName}.stories`,
        `${options.componentDir}/${options.dasherizedName}.component`
      ),
      hierarchy: options.name.substr(0, options.name.lastIndexOf('/') + 1)
    }),
    move(options.storyDir)
  ]));
}

function addDeclarationToStorybook(options: ExtendedOptions): Rule {
  return (host: Tree) => {
    if (!host.exists(storybookConfigPath)) {
      return host;
    }
    host.overwrite(storybookConfigPath, updateStorybookConfig(
      host.read(storybookConfigPath)!.toString('utf-8'),
      `${options.classifiedName}Component`,
      buildRelativePath(
        storybookConfigPath,
        `${options.componentDir}/${options.dasherizedName}.component`
      )
    ));
    return host;
  };
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
    const { path: storyPath } = parseName(`/${buildDefaultPath(project)}/../stories`, options.name);
    const dasherizedName = strings.dasherize(name);
    const classifiedName = strings.classify(name);
    const extendedOptions = {
      ...options,
      componentDir: options.flat ? componentPath : `${componentPath}/${dasherizedName}`,
      storyDir: options.flat ? storyPath : `${storyPath}/${dasherizedName}`,
      dasherizedName,
      classifiedName,
      selector: options.selector || buildSelector(name, options.prefix, project.prefix)
    };
    return chain([
      externalSchematic('@schematics/angular', 'component', options),
      createStory(extendedOptions),
      addDeclarationToStorybook(extendedOptions)
    ]);
  }
}