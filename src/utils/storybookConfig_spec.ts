import { updateStorybookConfig } from './storybookConfig';

describe('updateStorybookConfig', () => {
  it('should add import and declaration of the first created component', () => {
    expect(updateStorybookConfig(`import { configure } from '@storybook/angular';

// automatically import all files ending in *.stories.ts
const req = require.context('../src/stories', true, /.stories.ts$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);`, 'FooComponent', '../src/app/foo/foo.component'))
      .toBe(`import { FooComponent } from "../src/app/foo/foo.component";
import { configure, addDecorator, moduleMetadata } from '@storybook/angular'; // automatically import all files ending in *.stories.ts

const req = require.context('../src/stories', true, /.stories.ts$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addDecorator(moduleMetadata({
  declarations: [FooComponent]
}))
configure(loadStories, module);`);
  });
  it('should add import and declaration of the subsequently created component', () => {
    expect(updateStorybookConfig(`import { FooComponent } from "../src/app/foo/foo.component";
import { configure, addDecorator, moduleMetadata } from '@storybook/angular'; // automatically import all files ending in *.stories.ts

const req = require.context('../src/stories', true, /.stories.ts$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addDecorator(moduleMetadata({
  declarations: [FooComponent]
}));
configure(loadStories, module);`, 'BarComponent', '../src/app/foo/bar/bar.component'))
      .toBe(`import { BarComponent } from "../src/app/foo/bar/bar.component";
import { FooComponent } from "../src/app/foo/foo.component";
import { configure, addDecorator, moduleMetadata } from '@storybook/angular'; // automatically import all files ending in *.stories.ts

const req = require.context('../src/stories', true, /.stories.ts$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addDecorator(moduleMetadata({
  declarations: [FooComponent, BarComponent]
}));
configure(loadStories, module);`);
  });
  it('should not add import and declaration of the subsequently created component if it has already been added', () => {
    expect(updateStorybookConfig(`import { FooComponent } from "../src/app/foo/foo.component";
import { configure, addDecorator, moduleMetadata } from '@storybook/angular'; // automatically import all files ending in *.stories.ts

const req = require.context('../src/stories', true, /.stories.ts$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addDecorator(moduleMetadata({
  declarations: [FooComponent]
}));
configure(loadStories, module);`, 'FooComponent', '../src/app/foo/foo.component'))
      .toBe(`import { FooComponent } from "../src/app/foo/foo.component";
import { configure, addDecorator, moduleMetadata } from '@storybook/angular'; // automatically import all files ending in *.stories.ts

const req = require.context('../src/stories', true, /.stories.ts$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addDecorator(moduleMetadata({
  declarations: [FooComponent]
}));
configure(loadStories, module);`);
  });
});