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
        description: '$15 / month -  1 Service provider'
      },
      {
        id: 2,
        description: '$30 / month -  5 Service providers'
      },
      {
        id: 3,
        description: '$40 / month - 10 Service providers'
      },
      {
        id: 4,
        description: '$60 / month - 20 Service providers'
      }
    ];
    var SetPlanForm = require('./SetPlanForm');
    return (
      <SetPlanForm
                   plans={ _plans }
                   currentPlanDesc='$15 / month -  1 Service provider'
                   currentPlanMeta='Your next charge is $15 on June 16, 2015.'
                   name='planChecker'
                   value={ 0 } />
      );
  }
});

module.exports = clazz;