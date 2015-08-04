'use strict';
var Immutable = require('immutable');
var Cursor = require('immutable/contrib/cursor');
var ImmutableStore = birchpress.stores.ImmutableStore;

var clazz = birchpress.provide('brithoncrm.subscriptions.stores.SubscriptionStore', {

  __mixins__: [ImmutableStore],

  __construct__: function(self, data) {
    ImmutableStore.__construct__(self, data);
  },

  insertCardToken: function(self, token) {
    self.getCursor().set('card_token', token);
  },

  insertSubscription: function(self, userId, planId) {
    self.getCursor().set('user_id', userId);
    self.getCursor().set('plan_id', planId);
  },

  getAllPlans: function(self) {
    return self.retrieveApi({
      'action': 'birchpress_subscriptions_getplans',
    });
  },

  /**
    Data get via this function:
    
    customer_token
    card_number
    plan_id

    If returns nothing it indicates trial version.
  */
  getCustomerInfo: function(self, userId) {
    return self.retrieveApi({
      'action': 'birchpress_subscriptions_getcustomer',
      'uid': userId,
    });
  },

  updateCreditCard: function(self) {
    var newCardToken = self.getCursor().get('card_token');
    if (newCardToken) {
      self.submitApi({
        'action': 'birchpress_subscriptions_updatecard',
        'card_token': newCardToken,
      }, function(err, r) {
        if (err) {
          alert(err.error || err.message);
          return false;
        } else {
          return true;
        }
      });
    }
  },

  updatePlan: function(self) {
    var currentUId = self.getCursor().get('user_id');
    var newPlanId = self.getCursor().get('plan_id');
    if (currentUId && newPlanId) {
      self.submitApi({
        'action': 'birchpress_subscriptions_updateplan',
        'uid': currentUId,
        'plan_id': newPlanId,
      }, function(err, r) {
        if (err) {
          alert(err.error || err.message);
          return false;
        } else {
          return true;
        }
      });
    }
  },

  _ajax: function(self, method, url, data, callback) {
    jQuery.ajax({
      type: method,
      url: url,
      data: data,
      dataType: 'json'
    }).done(function(r) {
      if (r && r.error) {
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

  _post: function(self, url, data, callback) {
    if (arguments.length === 2) {
      callback = data;
      data = {};
    }
    self._ajax('POST', url, data, callback);
  },

  retrieveApi: function(self, postData) {
    self._post(bp_urls.ajax_url, postData,
      function(err, r) {
        if (err) {
          alert(err.error || err.message);
        } else {
          return r;
        }
      }
    );
  },

  submitApi: function(self, postData, callback) {
    self._post(bp_urls.ajax_url, postData, callback);
  }
});

module.exports = clazz;