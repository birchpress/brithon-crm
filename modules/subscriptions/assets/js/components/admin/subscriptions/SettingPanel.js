'use strict';
var React = require('react');
var ImmutableRenderMixin = require('react-immutable-render-mixin');
var birchpress = require('birchpress');

var ReactMixinCompositor = birchpress.react.MixinCompositor;

var clazz = birchpress.provide('brithoncrm.subscriptions.components.admin.subscriptions.SettingPanel', {

  __mixins__: [ReactMixinCompositor],

  getReactMixins: function(component) {
    return [ImmutableRenderMixin];
  },

  render: function(component) {
    var store = component.props.store;
    store.getCustomerInfo();
    var customer = store.getCursor().get('customer');

    var SetPlanForm = require('brithoncrm/subscriptions/components/admin/subscriptions/SetPlanForm');
    var SetCreditCardForm = require('brithoncrm/subscriptions/components/admin/subscriptions/SetCreditCardForm');
    var TrialForm = require('brithoncrm/subscriptions/components/admin/subscriptions/TrialForm');
    if (customer && customer.plan_id && customer.customer_token && customer.has_card) {
      var expireDate = new Date(customer.expire_date * 1000);
      var _card = 'XXXX-XXXX-XXXX-' + customer.card_last4;
      var _desc = customer.plan_desc;
      var _meta = component.__('Your next charge is $%s on %s');
      _meta = component.composeMetaString(_meta, customer.plan_charge / 100, expireDate.toDateString());

      return (
        <div>
          <SetPlanForm
                       plansFetcher={ component.retrieveAllPlans }
                       currentPlanDesc={ _desc }
                       currentPlanMeta={ _meta }
                       name='planChecker'
                       radioOnChange={ component.handlePlanChange }
                       onSubmitClick={ component.submitPlan }
                       __={ component.__ } />
          <SetCreditCardForm
                             currentCardNo={ _card }
                             onUpdateCard={ component.updateCardToken }
                             onSubmitClick={ component.submitCreditCard }
                             __={ component.__ } />
        </div>
        );
    } else {
      return (
        <div>
          <TrialForm
                     plansFetcher={ component.retrieveAllPlans }
                     name='planChecker'
                     radioOnChange={ component.handlePlanChange }
                     onUpdateCard={ component.updatePurchase }
                     onSubmitClick={ component.submitPurchase }
                     __={ component.__ } />
        </div>
        );
    }
  },

  retrieveAllPlans: function(component) {
    var store = component.props.store;
    if (!store.getCursor().get('plans')) {
      store.getAllPlans();
    }
    return store.getCursor().get('plans');
  },

  handlePlanChange: function(component, childComponent, event) {
    var store = component.props.store;
    store.insertSubscription(childComponent.props.value);
  },

  updateCardToken: function(component, token) {
    var store = component.props.store;
    store.insertCardToken(token);
    store.updateCreditCard();
  },

  updatePurchase: function(component, id, email) {
    var store = component.props.store;
    store.insertPurchase(id, email);
  },

  submitPlan: function(component) {
    return component.props.store.updatePlan();
  },

  submitCreditCard: function(component) {
    return component.props.store.updateCreditCard();
  },

  submitPurchase: function(component) {
    var store = component.props.store;
    var customerRes;
    store.registerCustomer();
    customerRes = store.getCursor().get('customer_id');
    if (customerRes) {
      var isUpdateSucceed = store.updatePlan();
      if (isUpdateSucceed) {
        alert(component.__('Purchase completed.'));
      }
    }
  },

  __: function(component, string) {
    var key = string.replace(/ /g, '_');
    var result;
    if (subscriptionsTranslations && subscriptionsTranslations[key]) {
      result = subscriptionsTranslations[key];
    } else {
      result = string;
    }
    return result;
  },

  composeMetaString: function(component, string, amount, dateStr) {
    var res = string;
    res = res.replace(/%s/, amount);
    res = res.replace(/%s/, dateStr);
    return res;
  }
});

module.exports = clazz;