export default {
  name: 'auth-service',
  initialize: function (container, application) {
    application.inject('route', 'authService', 'service:auth');
    application.inject('adapter', 'authService', 'service:auth');
  }
};
