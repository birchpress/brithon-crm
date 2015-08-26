var ns = birchpress.provide('brithoncrm.registration', {

  initModule: function() {
    birchpress.initNamespace(brithoncrm.registration);
  }
});

birchpress.addAction('birchpress.initFrameworkAfter', ns.initModule);