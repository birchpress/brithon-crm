'use strict';
var React = require('react');
var Immutable = require('immutable');
var birchpress = require('birchpress');

var RegStore = require('brithoncrm/registration/stores/RegistrationStore');
var i18nStore = require('brithoncrm/common/stores/i18nStore');

var regAppComponent;

var ns = birchpress.provide('brithoncrm.registration.apps.front.registration', {

  __init__: function() {
    birchpress.addAction('birchpress.initFrameworkAfter', ns.run);
  },

  run: function() {
    var regApp = require('brithoncrm/registration/components/front/registration/RegistrationPanel');
    var regData = Immutable.fromJS({});
    var i18nData = Immutable.fromJS({});
    var registerAppContainer = document.getElementById('registerapp');
    if (!regAppComponent && registerAppContainer) {
      var store = RegStore(regData);
      var tStore = i18nStore(i18nData);
      tStore.loadPO(i18n_registration.poString);
      regAppComponent = React.render(
        React.createElement(regApp, {
          store: store,
          translationStore: tStore,
          cursor: store.getCursor()
        }),
        registerAppContainer
      );
      store.setAttr('component', regAppComponent);
      birchpress.addAction('brithoncrm.registration.stores.RegistrationStore.onChangeAfter', function(_store, newCursor) {
        _store.getAttr('component').setProps({
          store: _store,
          cursor: newCursor
        });
      });

      tStore.setAttr('component', regAppComponent);
      birchpress.addAction('brithoncrm.common.stores.i18nStore.onChangeAfter', function(_tStore, newCursor) {
        tStore.getAttr('component').setProps({
          translationStore: _tStore,
          cursor: newCursor
        });
      });
    }
  }
});

module.exports = ns;
