import DS from 'ember-data';
import ENV from 'tv/config/environment';

export default DS.ActiveModelAdapter.extend({
  host: ENV.host,
  namespace: ENV.namespace,

  headers: function () {
    return {
      api_key: localStorage.apiKey
    };
  }.property().volatile(),

  ajaxError (jqXHR) {
    let error = this._super(jqXHR);
    if (error.status === 401) {
      this.authService.didDeAuth();
    }
    return error;
  }
});
