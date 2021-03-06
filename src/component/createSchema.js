const { writeFileSync } = require('fs');
const { join } = require('path');
require('json5/lib/register');

const schema = require('@schematics/angular/component/schema.json');

writeFileSync(join(__dirname, 'schema.json'), JSON.stringify({
  ...schema,
  id: 'SchematicsForStorybookComponent',
  properties: {
    ...schema.properties,
    noStory: {
      type: 'boolean',
      default: false,
      description: 'Skips creating a story for the created component'
    },
    useTemplate: {
      type: 'boolean',
      default: false,
      description: 'Uses a template string (e.g. ``template: `<app-foo></app-foo>` ``) instead of a component class (e.g. `component: FooComponent`) in the storybook'
    },
    tagAsLabel: {
      type: 'boolean',
      default: false,
      description: 'Uses a tag string (e.g. `<app-foo>`) as a label instead of a component class name (e.g. `FooComponent`) in the storybook'
    },
    replacePath: {
      type: 'string',
      default: '[]',
      description: 'Replaces the path of the story with a stringified array of `{ from: string, to: string }` which is to be used as `path.replace(new RegExp(from), to)`'
    },
    useComponentDir: {
      type: 'boolean',
      default: false,
      description: 'Use the same dir as the component instead of the stories dir'
    }
  }
}, null, 2));