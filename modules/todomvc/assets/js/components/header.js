var React = require('react');
var ImmutableRenderMixin = require('react-immutable-render-mixin');

var ReactMixinCompositor = birchpress.react.MixinCompositor;

var actions = require('../actions');

var clazz = birchpress.provide('brithoncrm.todomvc.components.Header', {

    __mixins__: [ReactMixinCompositor],

    getReactMixins: function(component) {
        return [ImmutableRenderMixin];
    },

    render: function(component) {
        var TodoTextInput = require('./todotextinput');
        return (
            <header id="header">
                <h1>todos</h1>
                <TodoTextInput
                    id="new-todo"
                    placeholder="What needs to be done?"
                    onSave={ component.onSave }
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
module.exports = clazz;
