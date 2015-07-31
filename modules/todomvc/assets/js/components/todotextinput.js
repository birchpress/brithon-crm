var React = require('react');
var ReactPropTypes = React.PropTypes;
var Immutable = require('immutable');
var Cursor = require('immutable/contrib/cursor');
var ImmutableRenderMixin = require('react-immutable-render-mixin');

var ReactMixinCompositor = birchpress.react.MixinCompositor;

var ENTER_KEY_CODE = 13;

var clazz = birchpress.provide('brithoncrm.todomvc.components.TodoTextInput', {

  __mixins__: [ReactMixinCompositor],

  getReactMixins: function(component) {
    return [ImmutableRenderMixin];
  },

  propTypes: {
    className: ReactPropTypes.string,
    id: ReactPropTypes.string,
    placeholder: ReactPropTypes.string,
    onSave: ReactPropTypes.func.isRequired,
    value: ReactPropTypes.string
  },

  getInitialState: function(component) {
    return {
      value: component.props.value || ''
    };
  },

  render: function(component) {
    return (
      <input
             className={ component.props.className }
             id={ component.props.id }
             placeholder={ component.props.placeholder }
             onBlur={ component.onBlur }
             onChange={ component.onChange }
             onKeyDown={ component.onKeyDown }
             value={ component.state.value }
             autoFocus={ true } />
      );
  },

  onBlur: function(component) {
    component.save();
  },

  onChange: function(component, event) {
    component.setState({
      value: event.target.value
    });
  },

  save: function(component) {
    component.props.onSave(component.state.value);
    component.setState({
      value: ''
    });
  },

  onKeyDown: function(component, event) {
    if (event.keyCode === ENTER_KEY_CODE) {
      component.save();
    }
  }

});
module.exports = clazz;
