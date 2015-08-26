'use strict';
require('brithoncrm/registration');
var React = require('react');
var Immutable = require('immutable');
var birchpress = require('birchpress');

var RegStore = require('brithoncrm/registration/stores/RegistrationStore');

var regAppComponent;

var ns = birchpress.provide('brithoncrm.registration.apps.front.registration', {

  __init__: function() {
    birchpress.addAction('brithoncrm.registration.apps.front.registration.initModuleAfter', ns.run);
  },

  initModule: function() {
    birchpress.initNamespace(brithoncrm.registration);
  },

  run: function() {
    var regApp = require('brithoncrm/registration/components/front/registration/RegistrationPanel');
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
      birchpress.addAction('brithoncrm.registration.stores.RegistrationStore.onChangeAfter', function(store, newCursor) {
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
