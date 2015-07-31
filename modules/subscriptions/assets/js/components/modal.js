var React = require('react');
var ImmutableRenderMixin = require('react-immutable-render-mixin');

var ReactMixinCompositor = birchpress.react.MixinCompositor;

var clazz = birchpress.provide('brithoncrm.subscriptions.components.Modal', {

  __mixins__: [ReactMixinCompositor],

  getReactMixins: function(component) {
    return [ImmutableRenderMixin];
  },

  killClick: function(component, event) {
    event.stopPropagation();
  },

  handleBackdropClick: function(component) {
    component.props.onRequestClose();
  },

  render: function(component) {
    return (
      <div
           { ...component.props }
           className="ModalBackdrop"
           onClick={ component.handleBackdropClick }>
        <div className="ModalContent" onClick={ component.killClick }>
          { component.props.children }
        </div>
      </div>
      );
  },
});

module.exports = clazz;
