import { storiesOf } from '@storybook/angular';<% if (!useTemplate) { %>
import { <%= classifiedName %>Component } from '<%= relativePath %>';<% } %>

storiesOf('<%= label %>', module)
  .add('default', () => ({
    <% if (useTemplate) { %>template: `<<%= selector %>></<%= selector %>>`<% } if (!useTemplate) { %>component: <%= classifiedName %>Component<% } %>
  }));