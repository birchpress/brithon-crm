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
    var settingAppContainer = document.getElementById('birchpress-settings');
    var globalParams = brithoncrm_subscriptions_apps_admin_subscriptions;
    var settingData = Immutable.fromJS({
      ajaxUrl: globalParams.ajax_url
    });
    var subscriptionStore = SubscriptionStore(settingData, globalParams.ajax_url);
    var i18nStore = I18nStore();

    function getProps() {
      return {
        store: subscriptionStore,
        i18n: i18nStore,
        cursor: subscriptionStore.getCursor(),
        i18nCursor: i18nStore.getCursor()
      };
    }

    if (!settingAppComponent && settingAppContainer) {
      i18nStore.loadTranslations(globalParams.translations);
      settingAppComponent = React.render(
        React.createElement(settingApp, getProps()),
        settingAppContainer
      );

      subscriptionStore.addAction('onChangeAfter', function() {
        settingAppComponent.setProps(getProps());
      });

      i18nStore.addAction('onChangeAfter', function() {
        settingAppComponent.setProps(getProps());
      });
    }
  }
});

module.exports = ns;
