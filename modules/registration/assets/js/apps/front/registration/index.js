'use strict';

var React = require('react');
var Immutable = require('immutable');
var birchpress = require('birchpress');
var RegistrationStore = require('brithoncrm/registration/stores/RegistrationStore');
var I18nStore = birchpress.stores.I18nStore;

var registrationAppComponent = null;

var ns = birchpress.provide('brithoncrm.registration.apps.front.registration', {

  __init__: function() {
    birchpress.addAction('birchpress.initFrameworkAfter', ns.run);
  },

  run: function() {
    var registrationApp = require('brithoncrm/registration/components/front/registration/RegistrationPanel');
    var registrationData = Immutable.fromJS({});
    var registerAppContainer = document.getElementById('registerapp');
    var globalParams = brithoncrm_registration_apps_front_registration;

    if (!registrationAppComponent && registerAppContainer) {
      var registrationStore = RegistrationStore(registrationData, globalParams.ajax_url);
      var i18nStore = I18nStore();

      i18nStore.loadTranslations(globalParams.translations);
      registrationAppComponent = React.render(
        React.createElement(registrationApp, {
          store: registrationStore,
          translationStore: i18nStore,
          cursor: registrationStore.getCursor()
        }),
        registerAppContainer
      );
      registrationStore.setAttr('component', registrationAppComponent);
      birchpress.addAction('brithoncrm.registration.stores.RegistrationStore.onChangeAfter', function(store, newCursor) {
        store.getAttr('component').setProps({
          store: store,
          cursor: newCursor
        });
      });

      i18nStore.setAttr('component', registrationAppComponent);
      birchpress.addAction('birchpress.stores.i18nStore.onChangeAfter', function(store, newCursor) {
        store.getAttr('component').setProps({
          translationStore: store,
          cursor: newCursor
        });
      });
    }
  }
});

module.exports = ns;
