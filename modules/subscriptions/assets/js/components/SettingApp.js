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
    var plans = store.getAllPlans();
    var customer = store.getCustomerInfo(bp_uid.uid);
    //for test
    plans = [
      {
        id: 1,
        desc: '$15 / month - 1 Service Provider',
      },
      {
        id: 2,
        desc: '$30 / month - 5 Service providers',
      },
      {
        id: 3,
        desc: '$40 / month - 10 Service providers',
      },
      {
        id: 4,
        desc: '$60 / month - 20 Service providers',
      },
    ];
    customer = {
      plan_id: 1,
      customer_token: 'cus_325rewafdsar432r',
      has_card: true,
      card_last4: '4242',
      plan_charge: 15,
      plan_max_providers: 1,
      expire_date: 'Sep 1st, 2016',
    };
    // end of test
    var SetPlanForm = require('./SetPlanForm');
    var SetCreditCardForm = require('./SetCreditCardForm');
    var TrialForm = require('./TrialForm');
    if (customer.plan_id && customer.customer_token && customer.has_card) {
      _card = 'XXXX-XXXX-XXXX-' + customer.card_last4;
      _desc = '$' + customer.plan_charge + ' / month - ' + customer.plan_max_providers + ' Service provider(s)';
      _meta = 'Your next cahrge is $' + customer.plan_charge + ' on ' + customer.expire_date;
      return (
        <div>
          <SetPlanForm
                       plans={ plans }
                       currentPlanDesc={ _desc }
                       currentPlanMeta={ _meta }
                       name='planChecker'
                       onChange={ component.handlePlanChange }
                       onSubmitClick={ component.submitPlan } />
          <SetCreditCardForm
                             currentCardNo={ _card }
                             onChange={ component.handleCardChange }
                             onSubmitClick={ component.submitCreditCard } />
        </div>
        );
    } else {
      return (
        <div>
          <TrialForm plans={ plans } name='planChecker' />
        </div>
        );
    }
  },

  handlePlanChange: function(component, childComponent, event) {
    var store = component.props.store;
    store.insertSubscription(bp_uid.uid, childComponent.props.value);
  },

  handleCardChange: function(component, childComponent, event) {
    var store = component.props.store;
    store.insertCardToken(bp_uid.uid, childComponent.props.value);
  },

  submitPlan: function(component) {
    return component.props.store.updatePlan();
  },

  submitCreditCard: function(component) {
    return component.props.store.updateCreditCard();
  },

  submitPurchase: function(component) {},
});

module.exports = clazz;