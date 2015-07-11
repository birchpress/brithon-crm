var React = require('react');
var ReactPropTypes = React.PropTypes;
var ImmutableRenderMixin = require('react-immutable-render-mixin');

var actions = require('../actions');

var ns = birchpress.namespace('brithoncrm.todomvc.components.footer', {

    getComponentClass: function () {
        var Footer = React.createClass({

            mixins: [ImmutableRenderMixin],

            propTypes: {
                allTodos: ReactPropTypes.object.isRequired
            },

            render: function() { return ns.render(this); }
        });

        return Footer;
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
                    onClick = { _.partial(ns.onClearCompletedClick, component) } >
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
module.exports = ns;
