var ns = birchpress.provide('brithoncrm.subscriptions', {

  initModule: function() {
    birchpress.initNamespace(brithoncrm.subscriptions);
  },
});

birchpress.addAction('birchpress.initFrameworkAfter', ns.initModule);