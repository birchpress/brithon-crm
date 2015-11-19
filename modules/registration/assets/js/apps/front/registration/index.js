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
    var registerAppContainer = document.getElementById('registerapp');
    var globalParams = brithoncrm_registration_apps_front_registration;
    var registrationData = Immutable.fromJS({
      ajaxUrl: globalParams.ajax_url,
      adminUrl: globalParams.admincp_url
    });
    var registrationStore = RegistrationStore(registrationData);
    var i18nStore = I18nStore();

    function getProps() {
      return {
        store: registrationStore,
        cursor: registrationStore.getCursor(),
        i18n: i18nStore,
        i18nCursor: i18nStore.getCursor()
      };
    }

    if (!registrationAppComponent && registerAppContainer) {
      i18nStore.loadTranslations(globalParams.translations);
      registrationAppComponent = React.render(
        React.createElement(registrationApp, {
          store: registrationStore,
          i18n: i18nStore,
          cursor: registrationStore.getCursor(),
          i18nCursor: i18nStore.getCursor()
        }),
        registerAppContainer
      );

      registrationStore.addAction('onChangeAfter', function() {
        registrationAppComponent.setProps(getProps());
      });

      i18nStore.addAction('onChangeAfter', function() {
        registrationAppComponent.setProps(getProps());
      });
    }
  }
});

module.exports = ns;
