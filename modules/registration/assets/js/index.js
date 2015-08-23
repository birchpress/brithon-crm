'use strict';
var React = require('react');
var Immutable = require('immutable');

var RegStore = require('brithoncrm/registration/stores/RegStore');

var regAppComponent;

var ns = birchpress.provide('brithoncrm.registration', {

  __init__: function() {
    birchpress.addAction('brithoncrm.registration.initModuleAfter', ns.run);
  },

  initModule: function() {
    birchpress.initNamespace(brithoncrm.registration);
  },

  run: function() {
    var regApp = require('brithoncrm/registration/components/index/registration/RegApp');
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
      birchpress.addAction('brithoncrm.registration.stores.RegStore.onChangeAfter', function(store, newCursor) {
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
