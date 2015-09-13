'use strict';

var React = require('react');
var Immutable = require('immutable');
var birchpress = require('birchpress');
var SubscriptionStore = require('brithoncrm/subscriptions/stores/SubscriptionStore');
var I18nStore = birchpress.stores.I18nStore;

var settingAppComponent;

var ns = birchpress.provide('brithoncrm.subscriptions.apps.admin.subscriptions', {

  __init__: function() {
    birchpress.addAction('birchpress.initFrameworkAfter', ns.run);
  },

  run: function() {
    var settingApp = require('brithoncrm/subscriptions/components/admin/subscriptions/SettingPanel');
    var settingData = Immutable.fromJS({});
    var settingAppContainer = document.getElementById('birchpress-settings');
    var globalParams = brithoncrm_subscriptions_apps_admin_subscriptions;
    var subscriptionStore = SubscriptionStore(settingData, globalParams.ajax_url);
    var i18nStore = I18nStore();

    if (!settingAppComponent && settingAppContainer) {
      i18nStore.loadTranslations(globalParams.translations);
      settingAppComponent = React.render(
        React.createElement(settingApp, {
          store: subscriptionStore,
          i18n: i18nStore,
          cursor: subscriptionStore.getCursor(),
          i18nCursor: i18nStore.getCursor()
        }),
        settingAppContainer
      );

      subscriptionStore._component = settingAppComponent;
      subscriptionStore.addAction('onChangeAfter', function() {
        settingAppComponent.setProps({
          store: subscriptionStore,
          cursor: subscriptionStore.getCursor()
        });
      });

      i18nStore._component = settingAppComponent;
      i18nStore.addAction('onChangeAfter', function() {
        settingAppComponent.setProps({
          i18n: i18nStore,
          i18nCursor: i18nStore.getCursor()
        });
      });
    }
  }
});

module.exports = ns;
