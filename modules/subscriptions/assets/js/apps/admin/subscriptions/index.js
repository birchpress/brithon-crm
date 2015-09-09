'use strict';

var React = require('react');
var Immutable = require('immutable');
var birchpress = require('birchpress');
var SubscriptionStore = require('brithoncrm/subscriptions/stores/SubscriptionStore');
var internationalizationStore = require('brithoncrm/common/stores/i18nStore');

var settingAppComponent;

var ns = birchpress.provide('brithoncrm.subscriptions.apps.admin.subscriptions', {

  __init__: function() {
    birchpress.addAction('birchpress.initFrameworkAfter', ns.run);
  },

  run: function() {
    var settingApp = require('brithoncrm/subscriptions/components/admin/subscriptions/SettingPanel');
    var settingData = Immutable.fromJS({});
    var i18nData = Immutable.fromJS({});
    var settingAppContainer = document.getElementById('birchpress-settings');
    var globalParams = brithoncrm_subscriptions_apps_admin_subscriptions;

    if (!settingAppComponent && settingAppContainer) {
      var subscriptionStore = SubscriptionStore(settingData, globalParams.ajax_url);
      var i18nStore = internationalizationStore(i18nData);

      i18nStore.loadPO(globalParams.poString);
      settingAppComponent = React.render(
        React.createElement(settingApp, {
          store: subscriptionStore,
          translationStore: i18nStore,
          cursor: subscriptionStore.getCursor()
        }),
        settingAppContainer
      );

      subscriptionStore.setAttr('component', settingAppComponent);
      birchpress.addAction('birchpress.subscriptions.stores.SubscriptionStore.onChangeAfter', function(store, newCursor) {
        store.getAttr('component').setProps({
          store: store,
          cursor: newCursor
        });
      });
      i18nStore.setAttr('component', settingAppComponent);
      birchpress.addAction('birchpress.common.stores.i18nStore.onChangeAfter', function(store, newCursor) {
        store.getAttr('component').setProps({
          translationStore: store,
          cursor: newCursor
        });
      });
    }
  }
});

module.exports = ns;
