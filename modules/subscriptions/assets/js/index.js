var React = require('react');

var stores = require('./stores');
var actions = require('./actions');

var regAppComponent;

var ns = birchpress.provide('brithoncrm.subscriptions', {

    __init__: function() {
        birchpress.addAction('brithoncrm.subscriptions.initModuleAfter', ns.run);
    },
    
    initModule: function() {
        birchpress.initNamespace(brithoncrm.subscriptions);
    },

    run: function() {
        var regApp = require('./components/regapp');
        if (!regAppComponent) {
            regAppComponent = React.render(
                React.createElement(regApp, {
                }),
                document.getElementById('registerapp')
            );
        }
    }
});
birchpress.addAction('birchpress.initFrameworkAfter', ns.initModule);
module.exports = ns;
