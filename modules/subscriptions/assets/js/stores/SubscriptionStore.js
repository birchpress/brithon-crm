'use strict';

var Immutable = require('immutable');
var Cursor = require('immutable/contrib/cursor');
var birchpress = require('birchpress');
var ImmutableStore = birchpress.stores.ImmutableStore;

var clazz = birchpress.provide('brithoncrm.subscriptions.stores.SubscriptionStore', {

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

  insertCardToken: function(self, token) {
    self.getCursor().set('cardToken', token);
  },

  insertSubscription: function(self, planId) {
    self.getCursor().set('planId', planId);
  },

  insertPurchase: function(self, stripeToken, email) {
    self.getCursor().set('stripeToken', stripeToken);
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
      });
  },

  registerCustomer: function(self) {
    var stripeToken = self.getCursor().get('stripeToken');
    var email = self.getCursor().get('email');
    var planId = self.getCursor().get('planId');
    var url = self.getCursor().get('ajaxUrl');

    self.getCursor().set('purchaseInProcess', true);

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

        self.postApi(
          url,
          {
            'action': 'birchpress_subscriptions_updateplan',
            'plan_id': planId
          }, function(err, r) {
            if (err) {
              return alert(err.error + ': ' + err.message);
            }
            self.getCursor().set('purchaseInProcess', undefined);
            self.getCustomerInfo();
          });
      }
    );
  },

  updateCreditCard: function(self) {
    var newCardToken = self.getCursor().get('cardToken');
    var url = self.getCursor().get('ajaxUrl');

    if (newCardToken) {
      self.getCursor().set('cardInProcess', true);

      self.postApi(
        url,
        {
          'action': 'birchpress_subscriptions_updatecard',
          'stripe_token': newCardToken
        }, function(err, r) {
          if (err) {
            alert(err.error + ': ' + err.message);
          } else {
            self.getCursor().set('cardInProcess', undefined);
            self.getCursor().set('panelRefresh', true);

            self.getCustomerInfo();
          }
        });
    }
  },

  updatePlan: function(self) {
    var newPlanId = self.getCursor().get('planId');
    var url = self.getCursor().get('ajaxUrl');

    if (newPlanId) {
      self.getCursor().set('planInProcess', true);

      self.postApi(
        url,
        {
          'action': 'birchpress_subscriptions_updateplan',
          'plan_id': newPlanId
        }, function(err, r) {
          if (err) {
            alert(err.error + ': ' + err.message);
          } else {
            self.getCursor().set('planInProcess', undefined);
            self.getCursor().set('panelRefresh', true);

            self.getCustomerInfo();
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
  }
});

module.exports = clazz;

