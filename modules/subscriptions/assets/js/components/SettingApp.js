'use strict';
var React = require('react');
var ImmutableRenderMixin = require('react-immutable-render-mixin');

var ReactMixinCompositor = birchpress.react.MixinCompositor;

var clazz = birchpress.provide('brithoncrm.subscriptions.components.SettingApp', {

  __mixins__: [ReactMixinCompositor],

  getReactMixins: function(component) {
    return [ImmutableRenderMixin];
  },

  render: function(component) {
    var store = component.props.store;
    store.getAllPlans();
    store.getCustomerInfo();
    var plans = store.getCursor().get('plans');
    var customer = store.getCursor().get('customer');

    var SetPlanForm = require('./SetPlanForm');
    var SetCreditCardForm = require('./SetCreditCardForm');
    var TrialForm = require('./TrialForm');
    if (customer && customer.plan_id && customer.customer_token && customer.has_card) {
      var _card = 'XXXX-XXXX-XXXX-' + customer.card_last4;
      var _desc = '$' + customer.plan_charge / 100 + ' / month - ' + customer.plan_max_providers + ' Service provider(s)';
      var _meta = 'Your next cahrge is $' + customer.plan_charge / 100 + ' on ' + customer.expire_date;
      return (
        <div>
          <SetPlanForm
                       plans={ plans }
                       currentPlanDesc={ _desc }
                       currentPlanMeta={ _meta }
                       name='planChecker'
                       radioOnChange={ component.handlePlanChange }
                       onSubmitClick={ component.submitPlan } />
          <SetCreditCardForm
                             currentCardNo={ _card }
                             onUpdateCard={ component.updateCardToken }
                             onSubmitClick={ component.submitCreditCard } />
        </div>
        );
    } else {
      return (
        <div>
          <TrialForm
                     plans={ plans }
                     name='planChecker'
                     radioOnChange={ component.handlePlanChange }
                     onUpdateCard={ component.updatePurchase }
                     onSubmitClick={ component.submitPurchase } />
        </div>
        );
    }
  },

  handlePlanChange: function(component, childComponent, event) {
    var store = component.props.store;
    // for test
    console.log(childComponent.props.value);
    // end of test
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
    customerRes = store.getCursor().get('customer')
    if (customerRes) {
      var isUpdateSucceed = store.updatePlan();
      if (isUpdateSucceed) {
        alert('Purchase completed.');
      }
    }
  }
});

module.exports = clazz;