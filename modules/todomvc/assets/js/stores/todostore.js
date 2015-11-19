'use strict';

var Immutable = require('immutable');
var birchpress = require('birchpress');
var ImmutableStore = birchpress.stores.ImmutableStore;

var clazz = birchpress.provide('brithoncrm.todomvc.stores.TodoStore', {

  __construct__: function(self, todos) {
    var immutableStore = ImmutableStore(Immutable.fromJS(todos));

    immutableStore.addAction('onChangeAfter', function() {
      self.onChange();
    });
    self._immutableStore = immutableStore;
  },

  onChange: function(self) {},

  getCursor: function(self) {
    return self._immutableStore.getCursor();
  },

  /**
   * Create a TODO item.
   * @param  {string} text The content of the TODO
   */
  create: function(self, text) {
    var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    var todo = Immutable.Map({
      id: id,
      complete: false,
      text: text
    });
    self.getCursor().set(id, todo);
  },

  /**
   * Update a TODO item.
   * @param  {string} id
   * @param {object} updates An object literal containing only the data to be
   *     updated.
   */
  update: function(self, id, updates) {
    var todo = self.getCursor().get(id);
    if (!Immutable.Map.isMap(updates)) {
      updates = Immutable.fromJS(updates);
    }
    todo.merge(updates);
  },

  /**
   * Update all of the TODO items with the same object.
   *     the data to be updated.  Used to mark all TODOs as completed.
   * @param  {object} updates An object literal containing only the data to be
   *     updated.

   */
  updateAll: function(self, updates) {
    self.getCursor().valueOf().forEach(function(value, key) {
      self.update(key, updates);
    });
  },

  /**
   * Delete a TODO item.
   * @param  {string} id
   */
  destroy: function(self, id) {
    self.getCursor().delete(id);
  },

  /**
   * Delete all the completed TODO items.
   */
  destroyCompleted: function(self) {
    self.getCursor().valueOf().forEach(function(value, key) {
      if (value.get('complete', false)) {
        self.destroy(key);
      }
    });
  },

  /**
   * Tests whether all the remaining TODO items are marked as completed.
   * @return {boolean}
   */
  areAllComplete: function(self) {
    var allComplete = true;
    self.getCursor().valueOf().forEach(function(value, key) {
      if (!value.get('complete', false)) {
        allComplete = false;
        return false;
      }
    });
    return allComplete;
  },

  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getAll: function(self) {
    return self.getCursor().deref();
  }

});

module.exports = clazz;
