import { storiesOf } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { <%= classifiedName %>Component } from '<%= relativePath %>';

storiesOf('<%= hierarchy %><%= selector %>', module)
  .add('default', () => ({
    component: <%= classifiedName %>Component
  }));