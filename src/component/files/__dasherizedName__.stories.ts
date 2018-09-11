import { storiesOf } from '@storybook/angular';<% if (!useTemplate) { %>
import { <%= classifiedName %>Component } from '<%= relativePath %>';<% } %>

storiesOf('<%= hierarchy %><% if (tagAsLabel) { %><<%= selector %>><% } if (!tagAsLabel) { %><%= classifiedName %>Component<% } %>', module)
  .add('default', () => ({
    <% if (useTemplate) { %>template: `<<%= selector %>></<%= selector %>>`<% } if (!useTemplate) { %>component: <%= classifiedName %>Component<% } %>
  }));