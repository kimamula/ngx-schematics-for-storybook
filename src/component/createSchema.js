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
      description: 'Uses a template string (e.g. `template: \`<app-foo><app-foo>\``) instead of a component class (e.g. `component: FooComponent`) in the storybook'
    }
  }
}, null, 2));