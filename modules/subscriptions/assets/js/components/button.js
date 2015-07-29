var React = require('react');
var ImmutableRenderMixin = require('react-immutable-render-mixin');

var ReactMixinCompositor = birchpress.react.MixinCompositor;

var clazz = birchpress.provide('brithoncrm.subscriptions.components.button', {

    __mixins__: [ReactMixinCompositor],

    getReactMixins: function(component) {
        return [ImmutableRenderMixin];
    },

    propTypes: {
        type: React.PropTypes.string,
        id: React.PropTypes.string,
        className: React.PropTypes.string,
        text: React.PropTypes.string,
        onClick: React.PropTypes.func
    },

    render: function(component) { 
        return (
            <button
                type={ component.props.type }
                id={ component.props.id }
                className={ component.props.className }
                onClick={ component.props.onClick }
            >{ component.props.text }</button>
        );
    },

    handleClick: function(component, event) {
        event.preventDefault();
        return component.props.onClick();
    }
});

module.exports = clazz;