birchpress.namespace('brithoncrm.todomvc.components.mainsection', function(ns) {

    var React = require('react');
    var ReactPropTypes = React.PropTypes;
    var ImmutableRenderMixin = require('react-immutable-render-mixin')

    var actions = require('../actions');

    ns.exports = {

        getComponentClass: function() {
            var MainSection = React.createClass({

                mixins: [ImmutableRenderMixin],

                propTypes: {
                    allTodos: ReactPropTypes.object.isRequired,
                    areAllComplete: ReactPropTypes.bool.isRequired
                },

                render: function() { return ns.render(this); },

                onToggleCompleteAll: _.partial(ns.onToggleCompleteAll, this)

            });

            return MainSection;
        },

        render: function (component) {
            var TodoItem = require('./todoitem').getComponentClass();
            var allTodos = component.props.allTodos.toJS();

            if (Object.keys(allTodos).length < 1) {
                return null;
            }

            var todos = [];

            for (var key in allTodos) {
                var todo = component.props.allTodos.get(key);
                todos.push(<TodoItem key={key} todo={todo} />);
            }

            return (
                <section id="main">
                    <input
                        id="toggle-all"
                        type="checkbox"
                        onChange={component.onToggleCompleteAll}
                        checked={component.props.areAllComplete ? 'checked' : ''}
                    />
                    <label htmlFor="toggle-all">Mark all as complete</label>
                    <ul id="todo-list">{todos}</ul>
                </section>
            );
        },

        onToggleCompleteAll: function (component) {
            actions.toggleCompleteAll();
        }
    };
    module.exports = ns;
});

