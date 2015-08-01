var React = require('react');
var ImmutableRenderMixin = require('react-immutable-render-mixin');

var ReactMixinCompositor = birchpress.react.MixinCompositor;

var clazz = birchpress.provide('brithoncrm.subscriptions.components.Radio', {

  __mixins__: [ReactMixinCompositor],

  getReactMixins: function(component) {
    return [ImmutableRenderMixin];
  },

  propTypes: {
    desc: React.PropTypes.string,
    checked: React.PropTypes.bool,
    value: React.PropTypes.number,
    name: React.PropTypes.string,
    id: React.PropTypes.string,
    className: React.PropTypes.string,
    onClick: React.PropTypes.func
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
               defaultValue={ component.props.value }
               defaultChecked={ component.props.checked }
               className={ component.props.className }
               id={ component.props.id }
               onClick={ component.props.onClick } />
        <label>
          { component.props.desc }
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