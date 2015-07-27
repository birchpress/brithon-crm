var React = require('react');
var Immutable = require('immutable');

var TodoStore = require('./stores/todostore');

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
    var todos = Immutable.fromJS({});
    if (!todoAppComponent) {
      var store = TodoStore(todos);
      todoAppComponent = React.render(
        React.createElement(TodoApp, {
          store: store,
          cursor: store.getCursor()
        }),
        document.getElementById('todoapp')
      );
      store.setAttr('component', todoAppComponent);
      birchpress.addAction('brithoncrm.todomvc.stores.TodoStore.onChangeAfter', function(store, newCursor) {
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