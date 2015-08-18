'use strict';
var React = require('react');
var Immutable = require('immutable');

var RegStore = require('./stores/regstore');
var SubscriptionStore = require('./stores/subscriptionstore');

var regAppComponent;
var settingAppComponent;

var ns = birchpress.provide('brithoncrm.subscriptions', {

  __init__: function() {
    birchpress.addAction('brithoncrm.subscriptions.initModuleAfter', ns.run);
  },

  initModule: function() {
    birchpress.initNamespace(brithoncrm.subscriptions);
  },

  run: function() {
    var regApp = require('./components/regapp');
    var regData = Immutable.fromJS({});
    var registerAppContainer = document.getElementById('registerapp');
    if (!regAppComponent && registerAppContainer) {
      var store = RegStore(regData);
      regAppComponent = React.render(
        React.createElement(regApp, {
          store: store,
          cursor: store.getCursor()
        }),
        registerAppContainer
      );
      store.setAttr('component', regAppComponent);
      birchpress.addAction('brithoncrm.subscriptions.stores.RegStore.onChangeAfter', function(store, newCursor) {
        store.getAttr('component').setProps({
          store: store,
          cursor: newCursor
        });
      });
    }

    var settingApp = require('./components/settingapp');
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
birchpress.addAction('birchpress.initFrameworkAfter', ns.initModule);
module.exports = ns;
