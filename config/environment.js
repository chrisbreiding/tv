/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'tv',
    usePodsByDefault: true,
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.host = process.env.host || '';
    ENV.namespace = process.env.host ? '' : 'api';
  }

  if (environment === 'production') {
    ENV.host = 'http://tvapi.crbapps.com'
    ENV.namespace = '';
  }

  return ENV;
};
