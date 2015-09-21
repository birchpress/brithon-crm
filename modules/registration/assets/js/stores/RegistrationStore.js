'use strict';

var birchpress = require('birchpress');
var Immutable = require('immutable');
var Cursor = require('immutable/contrib/cursor');

var ImmutableStore = birchpress.stores.ImmutableStore;

var clazz = birchpress.provide('brithoncrm.registration.stores.RegistrationStore', {

  __construct__: function(self, data) {
    var immutableStore = ImmutableStore(Immutable.fromJS(data));

    immutableStore.addAction('onChangeAfter', function(newCursor) {
      self.onChange();
    });
    self._immutableStore = immutableStore;
  },

  getCursor: function(self) {
    return self._immutableStore.getCursor();
  },

  onChange: function(self) {},

  insert: function(self, key, value) {
    self.getCursor().set(key, value);
  },

  submit: function(self) {
    var url = self.getCursor().get('ajaxUrl');
    var adminUrl = self.getCursor().get('adminUrl');

    if (!url) {
      return alert(self.__('URL undefined!'));
    }
    if (!self.getCursor().get('email')) {
      return alert(self.__('Empty email address!'));
    }
    if (!self.getCursor().get('password')) {
      return alert(self.__('Empty password!'));
    }
    if (!self.getCursor().get('first_name')) {
      return alert(self.__('First name required!'));
    }
    if (!self.getCursor().get('last_name')) {
      return alert(self.__('Last name required!'));
    }
    if (!self.getCursor().get('org')) {
      return alert(self.__('Organization required!'));
    }

    self.postApi(
      url,
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
          alert(err.message);
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
  },

  __: function(self, string) {
    return self.getAttr('component').__(string);
  }
});

module.exports = clazz;