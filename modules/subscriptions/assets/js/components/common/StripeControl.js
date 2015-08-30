'use strict';
var React = require('react');
var ImmutableRenderMixin = require('react-immutable-render-mixin');
var birchpress = require('birchpress');

var ReactMixinCompositor = birchpress.react.MixinCompositor;

var clazz = birchpress.provide('brithoncrm.subscriptions.components.common.StripeControl', {

  __mixins__: [ReactMixinCompositor],

  getReactMixins: function(component) {
    return [ImmutableRenderMixin];
  },

  propTypes: {
    onUpdateToken: React.PropTypes.func
  },

  getStripeHandler: function(component) {
    return component.props.handler;
  },

  handleClick: function(component, event) {
    var handler = component.getStripeHandler();
    handler.open({
      name: 'Brithon Inc.'
    });
    event.preventDefault();
  },

  handlePopState: function(component, event) {
    var handler = component.getStripeHandler();
    handler.close();
  },

  render: function(component) {
    var Button = require('brithoncrm/subscriptions/components/common/Button');
    return <div>
             <Button
                     id="submitCardButton"
                     text="Update My Card"
                     onClick={ component.handleClick } />
           </div>;
  }
});

module.exports = clazz;