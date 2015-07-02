birchpress.namespace('brithoncrm.todomvc', function(ns) {
    
    var React = require('react');

    var stores = require('./stores');
    var actions = require('./actions');

    var todoAppComponent;

    ns.exports = {

        init: function() {
            birchpress.addAction('birchpress.initFrameworkAfter', ns.run);
        },

        run: function() {
            var TodoApp = require('./components/todoapp').getComponentClass();
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
    };
    module.exports = ns;
});
