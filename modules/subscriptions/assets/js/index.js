var React = require('react');

var todoAppComponent;

var ns = birchpress.namespace('brithoncrm.subscriptions', {

    init: function() {
        birchpress.addAction('brithoncrm.subscriptions.initModuleAfter', ns.run);
    },
    
    initModule: function() {
        birchpress.initNamespace(brithoncrm.subscriptions);
    },

    run: function() {
        var TodoApp = require('./components/testapp').getComponentClass();
        if (!todoAppComponent) {
            todoAppComponent = React.render(
                React.createElement(TodoApp, {
                }),
                document.getElementById('registerapp')
            );
        }
    }
});
birchpress.addAction('birchpress.initFrameworkAfter', ns.initModule);
module.exports = ns;
