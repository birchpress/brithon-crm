var React = require('react');
var ReactPropTypes = React.PropTypes;
var Immutable = require('immutable');
var Cursor = require('immutable/contrib/cursor');
var ImmutableRenderMixin = require('react-immutable-render-mixin');

var actions = require('../actions');

var ENTER_KEY_CODE = 13;

var ns = birchpress.namespace('brithoncrm.todomvc.components.todotextinput', {

    getComponentClass: function() {
        var TodoTextInput = React.createClass({

            propTypes: {
                className: ReactPropTypes.string,
                id: ReactPropTypes.string,
                placeholder: ReactPropTypes.string,
                onSave: ReactPropTypes.func.isRequired,
                value: ReactPropTypes.string
            },

            getInitialState: function() { return ns.getInitialState(this); },

            render: function() { return ns.render(this); }
        });

        return TodoTextInput;
    },

    getInitialState: function (component) {
        return {
            value: component.props.value || ''
        };
    },

    render: function (component) {
        return (
            <input
                className={ component.props.className }
                id={ component.props.id }
                placeholder={ component.props.placeholder }
                onBlur={ _.partial(ns.onBlur, component) }
                onChange={ _.partial(ns.onChange, component) }
                onKeyDown={ _.partial(ns.onKeyDown, component) }
                value={ component.state.value }
                autoFocus={ true }
            />
        );
    },

    onBlur: function(component) {
        ns.save(component);
    },

    onChange: function (component, event) {
        component.setState({
            value: event.target.value
        });
    },

    save: function (component) {
        component.props.onSave(component.state.value);
        component.setState({
            value: ''
        });
    },

    onKeyDown: function (component, event) {
        if (event.keyCode === ENTER_KEY_CODE) {
            ns.save(component);
        }
    }

});
module.exports = ns;
