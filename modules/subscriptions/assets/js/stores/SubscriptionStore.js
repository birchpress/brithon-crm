'use strict';

var Immutable = require('immutable');
var Cursor = require('immutable/contrib/cursor');
var birchpress = require('birchpress');
var ImmutableStore = birchpress.stores.ImmutableStore;

var clazz = birchpress.provide('brithoncrm.subscriptions.stores.SubscriptionStore', {

  __mixins__: [ImmutableStore],

  __construct__: function(self, data, ajaxUrl) {
    ImmutableStore.__construct__(self, data);
    self.getCursor().set('ajaxUrl', ajaxUrl);
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
    var url = self.getCursor().get('ajaxUrl');

    self.postApi(
      url,
      {
        action: 'birchpress_subscriptions_getplans'
      },
      function(err, r) {
        if (err) {
          alert(err.message);
          return false;
        }
        self.getCursor().set('plans', r);

        self.getAttr('component').setProps({
          plansLoadOK: true
        });
      }
    );
  },

  getCustomerInfo: function(self) {
    var url = self.getCursor().get('ajaxUrl');

    self.postApi(
      url,
      {
        'action': 'birchpress_subscriptions_getcustomer'
      }, function(err, r) {
        if (err) {
          alert(err.message);
        }
        self.getCursor().set('customer', r);

        self.getAttr('component').setProps({
          loadOK: true
        });
      });
  },

  registerCustomer: function(self) {
    var stripeToken = self.getCursor().get('stripe_token');
    var email = self.getCursor().get('email');
    var planId = self.getCursor().get('plan_id');
    var url = self.getCursor().get('ajaxUrl');

    self.getAttr('component').setProps({
      purchaseInProcess: true
    });

    self.postApi(
      url,
      {
        action: 'birchpress_subscriptions_regcustomer',
        email: email,
        stripe_token: stripeToken
      }, function(err, r) {
        if (err) {
          return alert(self.__('Purchase failed - ') + err.message);
        }
        self.getCursor().set('customer_id', r.id);
        // --test--
        alert(r.id);

        self.postApi(
          url,
          {
            'action': 'birchpress_subscriptions_updateplan',
            'plan_id': planId
          }, function(err, r) {
            if (err) {
              return alert(err.error + ': ' + err.message);
            }
            self.getAttr('component').setProps({
              purchaseInProcess: undefined,
              loadOK: false
            });
            self.getCustomerInfo();
          });
      }
    );
  },

  updateCreditCard: function(self) {
    var newCardToken = self.getCursor().get('card_token');
    var url = self.getCursor().get('ajaxUrl');

    if (newCardToken) {
      self.getAttr('component').setProps({
        cardInProcess: true
      });

      self.postApi(
        url,
        {
          'action': 'birchpress_subscriptions_updatecard',
          'stripe_token': newCardToken
        }, function(err, r) {
          if (err) {
            alert(err.error + ': ' + err.message);
          } else {
            // --test--
            self.getAttr('component').setProps({
              cardInProcess: undefined,
              loadOK: false
            });
            self.getCustomerInfo();
            alert(self.__('Update Complete - Card'));
          }
        });
    }
  },

  updatePlan: function(self) {
    var newPlanId = self.getCursor().get('plan_id');
    var url = self.getCursor().get('ajaxUrl');

    if (newPlanId) {
      self.getAttr('component').setProps({
        planInProcess: true
      });

      self.postApi(
        url,
        {
          'action': 'birchpress_subscriptions_updateplan',
          'plan_id': newPlanId
        }, function(err, r) {
          if (err) {
            alert(err.error + ': ' + err.message);
          } else {
            self.getAttr('component').setProps({
              planInProcess: undefined,
              loadOK: false
            });
            self.getCustomerInfo();
            // --test--
            alert(self.__('Update Complete - Plan'));
          }
        });
    }
  },

  __: function(self, string) {
    var key = string.replace(/ /g, '_');
    var result;

    if (subscriptionsTranslations && subscriptionsTranslations[key]) {
      result = subscriptionsTranslations[key];
    } else {
      result = string;
    }
    return result;
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

  postApi: function(self, url, data, callback) {
    if (arguments.length === 2) {
      callback = data;
      data = {};
    }
    self._ajax('POST', url, data, callback);
  },

  showError: function(self, message) {
    return self.getAttr('component').setProps({
      errorMsg: message
    });
  }
});

module.exports = clazz;

