'use strict';
var React = require('react');
var Immutable = require('immutable');
var birchpress = require('birchpress');

var SubscriptionStore = require('brithoncrm/subscriptions/stores/SubscriptionStore');
var i18nStore = require('brithoncrm/common/stores/i18nStore');

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
    if (!settingAppComponent && settingAppContainer) {
      var store = SubscriptionStore(settingData);
      var tStore = i18nStore(i18nData);
      tStore.loadPO(i18n_subscriptions.poString);
      settingAppComponent = React.render(
        React.createElement(settingApp, {
          store: store,
          translationStore: tStore,
          cursor: store.getCursor()
        }),
        settingAppContainer
      );

      store.setAttr('component', settingAppComponent);
      birchpress.addAction('birchpress.subscriptions.stores.SubscriptionStore.onChangeAfter', function(_store, newCursor) {
        store.getAttr('component').setProps({
          store: _store,
          cursor: newCursor
        });
      });
      tStore.setAttr('component', settingAppComponent);
      birchpress.addAction('birchpress.common.stores.i18nStore.onChangeAfter', function(_tStore, newCursor) {
        tStore.getAttr('component').setProps({
          translationStore: _tStore,
          cursor: newCursor
        });
      });
    }
  }
});

module.exports = ns;
