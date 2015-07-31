var React = require('react');
var ImmutableRenderMixin = require('react-immutable-render-mixin');

var ReactMixinCompositor = birchpress.react.MixinCompositor;

var clazz = birchpress.provide('brithoncrm.subscriptions.components.Radio', {

  __mixins__: [ReactMixinCompositor],

  getReactMixins: function(component) {
    return [ImmutableRenderMixin];
  },

  propTypes: {
    description: React.PropTypes.string,
    checked: React.PropTypes.bool,
    value: React.PropTypes.number,
    name: React.PropTypes.string,
    id: React.PropTypes.string,
    className: React.PropTypes.string,
    onClick: React.PropTypes.func
  },

  getInitialState: function(component) {
    return component.props.checked || false;
  },

  render: function(component) {
    is_check = '';
    if (component.props.checked) {
      is_check = 'checked';
    }
    return (
      <div>
        <input
               type="radio"
               name={ component.props.name }
               value={ component.props.value }
               className={ component.props.className }
               id={ component.props.id }
               onClick={ component.props.onClick } />
        <label>
          { component.props.description }
        </label>
        <br />
      </div>
      );
  },

  handleClick: function(component, event) {
    return component.props.onClick;
  }
});

module.exports = clazz;