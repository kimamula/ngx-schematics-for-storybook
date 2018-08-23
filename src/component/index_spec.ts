import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { join } from 'path';
import './createSchema';

const collectionPath = join(__dirname, '../collection.json');

describe('component', () => {
  const runner = new SchematicTestRunner('ngx-schematics-for-storybook', collectionPath);
  const workspaceOptions = {
    name: 'workspace',
    newProjectRoot: 'projects',
    version: '6.0.0',
  };
  const appOptions = {
    name: 'bar',
    inlineStyle: false,
    inlineTemplate: false,
    routing: false,
    style: 'css',
    skipTests: false,
    skipPackageJson: false,
  };
  let appTree: UnitTestTree;
  beforeEach(() => {
    appTree = runner.runSchematic('workspace', workspaceOptions);
    appTree = runner.runSchematic('application', appOptions, appTree);
  });
  it('should create stories for a component', () => {
    const tree = runner.runSchematic('component', { name: 'foo', project: 'bar' }, appTree);
    expect(tree.files.indexOf('/projects/bar/src/stories/foo/foo.stories.ts') >= 0).toBe(true);
  });
  it('should not create stories for a component if noStory option is passed', () => {
    const tree = runner.runSchematic('component', { name: 'foo', project: 'bar', noStory: true }, appTree);
    expect(tree.files.indexOf('/projects/bar/src/stories/foo/foo.stories.ts') >= 0).toBe(false);
  });
});
