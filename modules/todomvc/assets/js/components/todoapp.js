'use react';

var React = require('react');
var ImmutableRenderMixin = require('react-immutable-render-mixin')

var ReactMixinCompositor = birchpress.react.MixinCompositor;

var clazz = birchpress.provide('brithoncrm.todomvc.components.TodoApp', {

  __mixins__: [ReactMixinCompositor],

  getReactMixins: function(component) {
    return [ImmutableRenderMixin];
  },

  render: function(component) {
    var Footer = require('./footer');
    var Header = require('./header');
    var MainSection = require('./mainsection');

    var store = component.props.store;

    return (
      <div>
        <Header onSaveText={ component.create } />
        <MainSection
                     allTodos={ store.getAll() }
                     areAllComplete={ store.areAllComplete() }
                     onToggleCompleteAll={ component.toggleCompleteAll }
                     onToggleComplete={ component.toggleComplete }
                     onUpdateItem={ component.updateItem }
                     onDestroyItem={ component.destroyItem
        } />
        <Footer allTodos={ store.getAll() } onClearCompletedClick={ component.clearCompleted } />
      </div>
      );
  },

  destroyItem: function(component, id) {
    var store = component.props.store;
    store.destroy(id);
  },

  updateItem: function(component, id, text) {
    var store = component.props.store;
    text = text.trim();
    if (text !== '') {
      store.update(id, {
        text: text
      });
    }
  },

  toggleComplete: function(component, todo) {
    var store = component.props.store;
    var id = todo.id;
    if (todo.complete) {
      store.update(id, {
        complete: false
      });
    } else {
      store.update(id, {
        complete: true
      });
    }
  },

  toggleCompleteAll: function(component) {
    var store = component.props.store;
    if (store.areAllComplete()) {
      store.updateAll({
        complete: false
      });
    } else {
      store.updateAll({
        complete: true
      });
    }
  },

  create: function(component, text) {
    var store = component.props.store;
    if (text.trim()) {
      store.create(text);
    }
  },

  clearCompleted: function(component) {
    var store = component.props.store;
    store.destroyCompleted();
  }
});

module.exports = clazz;
