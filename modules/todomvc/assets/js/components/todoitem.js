birchpress.namespace('brithoncrm.todomvc.components.todoitem', function(ns) {

    var React = require('react');
    var ReactPropTypes = React.PropTypes;
    var Immutable = require('immutable');
    var Cursor = require('immutable/contrib/cursor');
    var ImmutableRenderMixin = require('react-immutable-render-mixin');
    var cx = require('react/lib/cx');

    var actions = require('../actions');

    ns.exports = {
        getComponentClass: function() {
            var TodoItem = React.createClass({

                mixins: [ImmutableRenderMixin],

                propTypes: {
                    todo: ReactPropTypes.object.isRequired
                },

                getInitialState: function() { return ns.getInitialState(this); },

                render: function() { return ns.render(this); }
            });

            return TodoItem;
        },

        getInitialState: function (component) {
            return {
                'isEditing': false
            };
        },

        render: function (component) {
            var TodoTextInput = require('./todotextinput').getComponentClass();
            var todo = component.props.todo.toJS();

            var input;
            if (component.state.isEditing) {
                input =
                    <TodoTextInput
                        className="edit"
                        onSave={_.partial(ns.onSave, component)}
                        value={todo.text}
                    />;
            }

            return (
                <li
                    className={cx({
                        'completed': todo.complete,
                        'editing': component.state.isEditing
                    })}
                    key={todo.id}>
                    <div className="view">
                        <input
                            className="toggle"
                            type="checkbox"
                            checked={todo.complete}
                            onChange={_.partial(ns.onToggleComplete, component)}
                        />
                        <label onDoubleClick={_.partial(ns.onDoubleClick, component)}>
                            {todo.text}
                        </label>
                        <button className="destroy" onClick={_.partial(ns.onDestroyClick, component)} />
                    </div>
                    {input}
                </li>
            );
        },

        onToggleComplete: function (component) {
            actions.toggleComplete(component.props.todo.toJS());
        },

        onDoubleClick: function (component) {
            component.setState({
                isEditing: true
            });
        },

        onSave: function (component, text) {
            actions.updateText(component.props.todo.toJS().id, text);
            component.setState({
                isEditing: false
            });
        },

        onDestroyClick: function (component) {
            actions.destroy(component.props.todo.toJS().id);
        }

    };

    module.exports = ns;
});


