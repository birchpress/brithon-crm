'use strict';
var Immutable = require('immutable');
var Cursor = require('immutable/contrib/cursor');
var birchpress = require('birchpress');
var ImmutableStore = birchpress.stores.ImmutableStore;

var clazz = birchpress.provide('brithoncrm.subscriptions.stores.SubscriptionStore', {

  __mixins__: [ImmutableStore],

  __construct__: function(self, data) {
    ImmutableStore.__construct__(self, data);
  },

  insertCardToken: function(self, token) {
    self.getCursor().set('card_token', token);
  },

  insertSubscription: function(self, planId) {
    self.getCursor().set('plan_id', planId);
  },

  insertPurchase: function(self, stripeToken, email) {
    self.getCursor().set('stripe_token', stripeToken);
    self.getCursor().set('email', email);
  },

  getAllPlans: function(self) {
    self.postApi(
      bp_urls.ajax_url,
      {
        action: 'birchpress_subscriptions_getplans'
      },
      function(err, r) {
        if (err) {
          alert(err.message);
          return false;
        }
        return self.getCursor().set('plans', r);
      }
    );
  },

  getCustomerInfo: function(self) {
    self.postApi(
      bp_urls.ajax_url,
      {
        'action': 'birchpress_subscriptions_getcustomer'
      }, function(err, r) {
        if (err) {
          alert(err.message);
          return false;
        }
        return self.getCursor().set('customer', r);
      });
  },

  registerCustomer: function(self) {
    var stripeToken = self.getCursor().get('stripe_token');
    var email = self.getCursor().get('email');
    self.postApi(
      bp_urls.ajax_url,
      {
        action: 'birchpress_subscriptions_regcustomer',
        email: email,
        stripe_token: stripeToken
      }, function(err, r) {
        if (err) {
          alert('Purchase failed - ' + err.message);
          return false;
        }
        self.getCursor().set('customer_id', r.id);
        // --test--
        alert(r.id);
      }
    );
  },

  updateCreditCard: function(self) {
    var newCardToken = self.getCursor().get('card_token');
    if (newCardToken) {
      self.postApi(
        bp_urls.ajax_url,
        {
          'action': 'birchpress_subscriptions_updatecard',
          'stripe_token': newCardToken
        }, function(err, r) {
          if (err) {
            alert(err.error + ': ' + err.message);
            return false;
          } else {
            // --test--
            alert('Update Complete - Card');
            return true;
          }
        });
    }
  },

  updatePlan: function(self) {
    var newPlanId = self.getCursor().get('plan_id');
    if (newPlanId) {
      self.postApi(
        bp_urls.ajax_url,
        {
          'action': 'birchpress_subscriptions_updateplan',
          'plan_id': newPlanId
        }, function(err, r) {
          if (err) {
            alert(err.error + ': ' + err.message);
            return false;
          } else {
            // --test--
            alert('Update Complete - Plan')
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
      dataType: 'json',
      async: false
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

  postApi: function(self, url, data, callback) {
    if (arguments.length === 2) {
      callback = data;
      data = {};
    }
    self._ajax('POST', url, data, callback);
  }
});

module.exports = clazz;

