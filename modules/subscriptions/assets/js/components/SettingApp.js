var React = require('react');
var ImmutableRenderMixin = require('react-immutable-render-mixin');

var ReactMixinCompositor = birchpress.react.MixinCompositor;

var clazz = birchpress.provide('brithoncrm.subscriptions.components.SettingApp', {

  __mixins__: [ReactMixinCompositor],

  getReactMixins: function(component) {
    return [ImmutableRenderMixin];
  },

  render: function(component) {
    _plans = [
      {
        id: 1,
        desc: '$15 / month -  1 Service provider'
      },
      {
        id: 2,
        desc: '$30 / month -  5 Service providers'
      },
      {
        id: 3,
        desc: '$40 / month - 10 Service providers'
      },
      {
        id: 4,
        desc: '$60 / month - 20 Service providers'
      }
    ];
    var SetPlanForm = require('./SetPlanForm');
    var SetCreditCardForm = require('./SetCreditCardForm');
    return (
      <div>
        <SetPlanForm
                     plans={ _plans }
                     currentPlanDesc='$15 / month -  1 Service provider'
                     currentPlanMeta='Your next charge is $15 on June 16, 2015.'
                     name='planChecker' />
        <SetCreditCardForm currentCardNo="4242-4242-4242-4242" />
      </div>
      );
  }
});

module.exports = clazz;