var React = require('react');

var todoAppComponent;

var ns = birchpress.namespace('brithoncrm.test', {

    init: function() {
        birchpress.addAction('brithoncrm.test.initModuleAfter', ns.run);
    },
    
    initModule: function() {
        birchpress.initNamespace(brithoncrm.test);
    },

    run: function() {
        var TodoApp = require('./components/testapp').getComponentClass();
        if (!todoAppComponent) {
            todoAppComponent = React.render(
                React.createElement(TodoApp, {
                }),
                document.getElementById('todoapp')
            );
        }
    }
});
birchpress.addAction('birchpress.initFrameworkAfter', ns.initModule);
module.exports = ns;
