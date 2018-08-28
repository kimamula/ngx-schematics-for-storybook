import { storiesOf } from '@storybook/angular';
import { action } from '@storybook/addon-actions';<% if (!useTemplate) { %>
import { <%= classifiedName %>Component } from '<%= relativePath %>';<% } %>

storiesOf('<%= hierarchy %><%= selector %>', module)
  .add('default', () => ({
    <% if (useTemplate) { %>template: `<<%= selector %>></<%= selector %>>`<% } if (!useTemplate) { %>component: <%= classifiedName %>Component<% } %>
  }));