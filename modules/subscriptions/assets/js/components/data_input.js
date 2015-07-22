var React = require('react');

var ReactMixinCompositor = birchpress.react.MixinCompositor;

var clazz = birchpress.provide('brithoncrm.subscriptions.components.data_input', {

    __mixins__: [ReactMixinCompositor],

    propTypes: {
        type: React.PropTypes.string,
        name: React.PropTypes.string,
        id: React.PropTypes.string,
        className: React.PropTypes.string,
        placeholder: React.PropTypes.string,
        value: React.PropTypes.string,
        onChange: React.PropTypes.func
    },

    getInitialState: function(component) {
        return {
            value: component.props.value || ''
        };
    },

    handleChange: function(component, event) {
        component.setState({
            value: event.target.value
        });
        component.props.onChange(component, event);
    },

    render: function(component) { 
        return (
            <input
                type={ component.props.type }
                name={ component.props.name }
                id={ component.props.id }
                className={ component.props.className }
                placeholder={ component.props.placeholder }
                onChange={ component.handleChange }
                value={ component.state.value }
            />
        );
    }
});

module.exports = clazz;