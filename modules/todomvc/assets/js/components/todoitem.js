var React = require('react');
var ReactPropTypes = React.PropTypes;
var Immutable = require('immutable');
var Cursor = require('immutable/contrib/cursor');
var ImmutableRenderMixin = require('react-immutable-render-mixin');
var cx = require('react/lib/cx');

var ReactMixinCompositor = birchpress.react.MixinCompositor;
var actions = require('../actions');

var clazz = birchpress.provide('brithoncrm.todomvc.components.TodoItem', {

    __mixins__: [ReactMixinCompositor],

    getReactMixins: function(component) {
        return [ImmutableRenderMixin];
    },

    propTypes: {
        todo: ReactPropTypes.object.isRequired
    },

    getInitialState: function (component) {
        return {
            'isEditing': false
        };
    },

    render: function (component) {
        var TodoTextInput = require('./todotextinput');
        var todo = component.props.todo.toJS();

        var input;
        if (component.state.isEditing) {
            input =
                <TodoTextInput
                    className="edit"
                    onSave={ component.onSave }
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
                        onChange={ component.onToggleComplete }
                    />
                    <label onDoubleClick={ component.onDoubleClick }>
                        {todo.text}
                    </label>
                    <button className="destroy" onClick={ component.onDestroyClick } />
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

});
module.exports = clazz;


