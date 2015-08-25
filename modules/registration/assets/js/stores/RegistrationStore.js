'use strict';
var Immutable = require('immutable');
var Cursor = require('immutable/contrib/cursor');
var ImmutableStore = birchpress.stores.ImmutableStore;
var birchpress = require('birchpress');

var clazz = birchpress.provide('brithoncrm.registration.stores.RegistrationStore', {

  __mixins__: [ImmutableStore],

  __construct__: function(self, data) {
    ImmutableStore.__construct__(self, data);
  },

  insert: function(self, key, value) {
    self.getCursor().set(key, value);
  },

  submit: function(self) {
    self.postApi(
      bp_urls.ajax_url,
      {
        'action': 'register_birchpress_account',
        'username': self.getCursor().get('email'),
        'password': self.getCursor().get('password'),
        'email': self.getCursor().get('email'),
        'first_name': self.getCursor().get('first_name'),
        'last_name': self.getCursor().get('last_name'),
        'org': self.getCursor().get('org')
      },
      function(err, r) {
        if (err) {
          alert(err.error || err.message);
        } else {
          location.assign(bp_urls.admincp_url);
        }
      }
    );
  },

  generateUserName: function(self, firstName, lastName) {
    return firstName + '_' + lastName + Math.random().toString();
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