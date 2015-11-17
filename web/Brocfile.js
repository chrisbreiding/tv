/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp({
  vendorFiles: {
    'handlebars.js': null
  },
  sourcemaps: {
    enabled: false
  },
  stylusOptions: {
    includePaths: [
      'app/vendor',
      'app'
    ],
    sourceMap: false
  }
});

app.import('bower_components/moment/moment.js');

module.exports = app.toTree();