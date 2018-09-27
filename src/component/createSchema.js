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
    replaceLabel: {
      type: 'object',
      default: {},
      description: 'Provides a map object whose keys are regular expressions and whose values are strings which are used to replace labels in the storybook with `String.prototype.replace`'
    }
  }
}, null, 2));