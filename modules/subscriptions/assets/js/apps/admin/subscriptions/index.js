'use strict';
var React = require('react');
var Immutable = require('immutable');
var birchpress = require('birchpress');

var SubscriptionStore = require('brithoncrm/subscriptions/stores/SubscriptionStore');

var settingAppComponent;

var ns = birchpress.provide('brithoncrm.subscriptions.apps.admin.subscriptions', {

  __init__: function() {
    birchpress.addAction('birchpress.initFrameworkAfter', ns.run, 20);
  },

  run: function() {
    var settingApp = require('brithoncrm/subscriptions/components/admin/subscriptions/SettingPanel');
    var settingData = Immutable.fromJS({});
    var settingAppContainer = document.getElementById('birchpress-settings');
    if (!settingAppComponent && settingAppContainer) {
      var store2 = SubscriptionStore(settingData);
      settingAppComponent = React.render(
        React.createElement(settingApp, {
          store: store2,
          cursor: store2.getCursor(),
        }),
        settingAppContainer
      );
      store2.setAttr('component', settingAppComponent);
      birchpress.addAction('birchpress.subscriptions.stores.SubscriptionStore.onChangeAfter', function(store, newCursor) {
        store.getAttr('component').setProps({
          store: store,
          cursor: newCursor
        });
      });
    }
  }
});

module.exports = ns;
