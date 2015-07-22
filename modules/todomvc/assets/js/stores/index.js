var Immutable = require('immutable');
var Cursor = require('immutable/contrib/cursor');

var _todos = Immutable.fromJS({});
var createCursor = function() {
    return Cursor.from(_todos, function(newData) {
        _todos = newData;
        todosCursor = createCursor();
        ns.onChange(newData);
    });
};
var todosCursor = createCursor();

var ns = birchpress.provide('brithoncrm.todomvc.stores', {

    __init__: function() {
        birchpress.addAction('brithoncrm.todomvc.actions.createAfter', function(text) {
            text = text.trim();
            if (text !== '') {
                ns.create(text);
            }
        });
        birchpress.addAction('brithoncrm.todomvc.actions.updateTextAfter', function(id, text) {
            text = text.trim();
            if (text !== '') {
                ns.update(id, {
                    text: text
                });
            }
        });
        birchpress.addAction('brithoncrm.todomvc.actions.toggleCompleteAfter', function(todo) {
            var id = todo.id;
            if (todo.complete) {
                ns.update(id, {
                    complete: false
                });
            } else {
                ns.update(id, {
                    complete: true
                });
            }
        });
        birchpress.addAction('brithoncrm.todomvc.actions.toggleCompleteAllAfter', function() {
            if (ns.areAllComplete()) {
                ns.updateAll({
                    complete: false
                });
            } else {
                ns.updateAll({
                    complete: true
                });
            }
        });
        birchpress.addAction('brithoncrm.todomvc.actions.destroyAfter', function(id) {
            ns.destroy(id);
        });
        birchpress.addAction('brithoncrm.todomvc.actions.destroyCompletedAfter', function() {
            ns.destroyCompleted();
        });
    },

    onChange: function(newData) {},

    /**
     * Create a TODO item.
     * @param  {string} text The content of the TODO
     */
    create: function(text) {
        // Hand waving here -- not showing how this interacts with XHR or persistent
        // server-side storage.
        // Using the current timestamp + random number in place of a real id.
        var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
        var todo = Immutable.Map({
            id: id,
            complete: false,
            text: text
        });
        todosCursor.set(id, todo);
    },

    /**
     * Update a TODO item.
     * @param  {string} id
     * @param {object} updates An object literal containing only the data to be
     *     updated.
     */
    update: function(id, updates) {
        var todo = todosCursor.get(id);
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
    updateAll: function(updates) {
        todosCursor.valueOf().forEach(function(value, key) {
            ns.update(key, updates);
        });
    },

    /**
     * Delete a TODO item.
     * @param  {string} id
     */
    destroy: function(id) {
        todosCursor.delete(id);
    },

    /**
     * Delete all the completed TODO items.
     */
    destroyCompleted: function() {
        todosCursor.valueOf().forEach(function(value, key) {
            if (value.get('complete', false)) {
                ns.destroy(key);
            }
        });
    },

    /**
     * Tests whether all the remaining TODO items are marked as completed.
     * @return {boolean}
     */
    areAllComplete: function() {
        var allComplete = true;
        todosCursor.valueOf().forEach(function(value, key) {
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
    getAll: function() {
        return _todos;
    }

});
module.exports = ns;
