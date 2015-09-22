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
    var SetPlanForm = require('brithoncrm/subscriptions/components/admin/subscriptions/SetPlanForm');
    var SetCreditCardForm = require('brithoncrm/subscriptions/components/admin/subscriptions/SetCreditCardForm');
    var TrialForm = require('brithoncrm/subscriptions/components/admin/subscriptions/TrialForm');
    var customer = store.getCursor().get('customer');
    var status = {
      planInProcess: store.getCursor().get('planInProcess'),
      cardInProcess: store.getCursor().get('cardInProcess'),
      purchaseInProcess: store.getCursor().get('purchaseInProcess')
    };

    if (!customer) {
      store.getCustomerInfo();
      return (<div>
                <p>
                  { component.__('Please wait. Loading...') }
                </p>
              </div>);
    }

    if (customer && customer.plan_id && customer.customer_token && customer.has_card) {
      var expireDate = new Date(customer.expire_date * 1000);
      var _card = 'XXXX-XXXX-XXXX-' + customer.card_last4;
      var _desc = customer.plan_desc;
      var _meta = component.__('Your next charge is $%s on %s');
      _meta = _meta.replace(/%s/, customer.plan_charge / 100).replace(/%s/, expireDate.toLocaleString());

      return (
        <div>
          <SetPlanForm
                       plansFetcher={ component.retrieveAllPlans }
                       currentPlanDesc={ _desc }
                       currentPlanMeta={ _meta }
                       name="planChecker"
                       radioOnChange={ component.handlePlanChange }
                       onSubmitClick={ component.submitPlan }
                       inProcess={ status.planInProcess }
                       shown={ store.getCursor().get('SetPlanForm') }
                       handleSwitch={ component.handleSwitch }
                       value={ store.getCursor().get('planId') }
                       __={ component.__ } />
          <SetCreditCardForm
                             currentCardNo={ _card }
                             onUpdateCard={ component.updateCardToken }
                             onSubmitClick={ component.submitCreditCard }
                             shown={ store.getCursor().get('SetCreditCardForm') }
                             inProcess={ status.cardInProcess }
                             handleSwitch={ component.handleSwitch }
                             __={ component.__ } />
        </div>
        );
    } else {
      return (
        <div>
          <TrialForm
                     plansFetcher={ component.retrieveAllPlans }
                     name="planChecker"
                     radioOnChange={ component.handlePlanChange }
                     onUpdateCard={ component.updatePurchase }
                     onSubmitClick={ component.submitPurchase }
                     inProcess={ status.purchaseInProcess }
                     shown={ store.getCursor().get('TrialForm') }
                     handleSwitch={ component.handleSwitch }
                     value={ store.getCursor().get('planId') }
                     __={ component.__ } />
        </div>
        );
    }
  },

  handleSwitch: function(component, childComponent, key) {
    var store = component.props.store;
    var shown = store.getCursor().get(key);
    return store.getCursor().set(key, !shown);
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
    store.registerCustomer();
  },

  __: function(component, string) {
    var i18n = component.props.i18n;
    return i18n.getText(string);
  }
});

module.exports = clazz;