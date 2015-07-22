var React = require('react');

var stores = require('./stores');
var actions = require('./actions');

var todoAppComponent;

var ns = birchpress.provide('brithoncrm.todomvc', {

    __init__: function() {
        birchpress.addAction('brithoncrm.todomvc.initModuleAfter', ns.run);
    },
    
    initModule: function() {
        birchpress.initNamespace(brithoncrm.todomvc);
    },

    run: function() {
        var TodoApp = require('./components/todoapp');
        if (!todoAppComponent) {
            todoAppComponent = React.render(
                React.createElement(TodoApp, {
                    todoStore: ns.getTodoStore()
                }),
                document.getElementById('todoapp')
            );
            birchpress.addAction('brithoncrm.todomvc.stores.onChangeAfter', function() {
                todoAppComponent.setProps({
                    todoStore: ns.getTodoStore()
                });
            });
        }
    },

    /**
     * Retrieve the current TODO data from the TodoStore
     */
    getTodoStore: function() {
        return {
            allTodos: stores.getAll(),
            areAllComplete: stores.areAllComplete()
        };
    }
});
birchpress.addAction('birchpress.initFrameworkAfter', ns.initModule);
module.exports = ns;
