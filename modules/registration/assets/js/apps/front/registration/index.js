'use strict';
var React = require('react');
var Immutable = require('immutable');
var birchpress = require('birchpress');

var RegStore = require('brithoncrm/registration/stores/RegistrationStore');
var TranslationStore = require('brithoncrm/registration/stores/TranslationStore');

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
      var translationStore = TranslationStore(i18nData);
      regAppComponent = React.render(
        React.createElement(regApp, {
          store: store,
          translationStore: translationStore,
          cursor: store.getCursor()
        }),
        registerAppContainer
      );
      store.setAttr('component', regAppComponent);
      birchpress.addAction('brithoncrm.registration.stores.RegistrationStore.onChangeAfter', function(store, newCursor) {
        store.getAttr('component').setProps({
          store: store,
          cursor: newCursor
        });
      });
      translationStore.setAttr('component', regAppComponent);
      birchpress.addAction('brithoncrm.registration.stores.TranslationStore.onChangeAfter', function(store, newCursor) {
        store.getAttr('component').setProps({
          translationStore: store,
          cursor: newCursor
        });
      });
    }
  }
});

module.exports = ns;
