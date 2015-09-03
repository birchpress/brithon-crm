'use strict';
var birchpress = require('birchpress');
var Immutable = require('immutable');
var Cursor = require('immutable/contrib/cursor');

var ImmutableStore = birchpress.stores.ImmutableStore;

var clazz = birchpress.provide('brithoncrm.registration.stores.TranslationStore', {

  __mixins__: [ImmutableStore],

  __construct__: function(self, data) {
    ImmutableStore.__construct__(self, data);
  },

  translate: function(self, string) {
    self.postApi(
      bp_urls.ajax_url,
      {
        'action': 'brithoncrm_registration_i18n',
        'string': string
      },
      function(err, r) {
        if (err) {
          return self.getCursor().set(string, string);
        } else {
          return self.getCursor().set(string, r.result);
        }
      }
    );
  },

  _ajax: function(self, method, url, data, callback) {
    jQuery.ajax({
      type: method,
      url: url,
      data: data,
      dataType: 'json'
    }).done(function(r) {
      if (r && (r.message || r.error)) {
        return callback && callback(r);
      }
      return callback && callback(null, r);
    }).fail(function(jqXHR, textStatus) {
      return callback && callback({
          error: 'HTTP ' + jqXHR.status,
          message: 'Network error (HTTP ' + jqXHR.status + ')'
        });
    });
  },

  postApi: function(self, url, data, callback) {
    if (arguments.length === 2) {
      callback = data;
      data = {};
    }
    self._ajax('POST', url, data, callback);
  }
});

module.exports = clazz;