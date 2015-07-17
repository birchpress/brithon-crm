var React = require('react');
var ImmutableRenderMixin = require('react-immutable-render-mixin');

var actions = require('../actions');

var ns = birchpress.namespace('brithoncrm.todomvc.components.header', {

    getComponentClass: function () {
        var Header = React.createClass({

            mixins: [ImmutableRenderMixin],

            render: function() { return ns.render(this); }
        });

        return Header;
    },

    render: function(component) {
        var TodoTextInput = require('./todotextinput').getComponentClass();
        return (
            <header id="header">
                <h1>todos</h1>
                <TodoTextInput
                    id="new-todo"
                    placeholder="What needs to be done?"
                    onSave={ _.partial(ns.onSave, component) }
                />
            </header>
        );
    },

    onSave: function(component, text) {
        if (text.trim()) {
            actions.create(text);
        }
    }
});
module.exports = ns;
