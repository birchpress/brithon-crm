var React = require('react');
var ImmutableRenderMixin = require('react-immutable-render-mixin');
var birchpress = require('birchpress');

var ReactMixinCompositor = birchpress.react.MixinCompositor;

var clazz = birchpress.provide('brithoncrm.subscriptions.components.common.DataInput', {

  __mixins__: [ReactMixinCompositor],

  getReactMixins: function(component) {
    return [ImmutableRenderMixin];
  },

  propTypes: {
    type: React.PropTypes.string,
    name: React.PropTypes.string,
    id: React.PropTypes.string,
    className: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    value: React.PropTypes.string,
    onChange: React.PropTypes.func,
  },

  getInitialState: function(component) {
    return {
      value: component.props.value || '',
    };
  },

  handleChange: function(component, event) {
    component.props.value = event.target.value;
    return component.props.onChange(component, event);
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
             value={ component.props.value } />
      );
  },
});

module.exports = clazz;
