var React = require('react');
var ReactPropTypes = React.PropTypes;
var ImmutableRenderMixin = require('react-immutable-render-mixin');

var ReactMixinCompositor = birchpress.react.MixinCompositor;

var actions = require('../actions');

var clazz = birchpress.provide('brithoncrm.todomvc.components.Footer', {

    __mixins__: [ReactMixinCompositor],

    getReactMixins: function(component) {
        return [ImmutableRenderMixin];
    },

    propTypes: {
        allTodos: ReactPropTypes.object.isRequired
    },

    render: function (component) {
        var allTodos = component.props.allTodos.toJS();
        var total = Object.keys(allTodos).length;

        if (total === 0) {
            return null;
        }

        var completed = 0;
        for (var key in allTodos) {
            if (allTodos[key].complete) {
                completed++;
            }
        }

        var itemsLeft = total - completed;
        var itemsLeftPhrase = itemsLeft === 1 ? ' item ' : ' items ';
        itemsLeftPhrase += 'left';

        var clearCompletedButton;
        if (completed) {
            clearCompletedButton = (
                <button
                    id = "clear-completed"
                    onClick = { component.onClearCompletedClick } >
                    Clear completed({ completed })
                </button>
            );
        }

        return (
            <footer id = "footer" >
                <span id = "todo-count" >
                    <strong > { itemsLeft } </strong>
                    { itemsLeftPhrase }
                </span> 
                { clearCompletedButton }
            </footer>
        );
    },
    
    onClearCompletedClick: function (component) {
        actions.destroyCompleted();
    }

});
module.exports = clazz;
