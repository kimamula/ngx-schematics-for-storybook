import { storiesOf } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { <%= classifiedName %>Component } from '<%= relativePath %>';

storiesOf('<%= selector %>', module)
  .add('default', () => ({
    component: <%= classifiedName %>Component,
    props: {},
    moduleMetadata: {
      imports: [],
      schemas: [],
      declarations: [],
      providers: []
    }
  }));