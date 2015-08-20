'use strict';
var React = require('react');
var ImmutableRenderMixin = require('react-immutable-render-mixin');

var ReactMixinCompositor = birchpress.react.MixinCompositor;

var clazz = birchpress.provide('brithoncrm.subscriptions.components.StripeControl', {

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
    var Button = require('./Button');
    return <div>
             <Button
                     id="submitCardButton"
                     text="Update My Card"
                     onClick={ component.handleClick } />
           </div>;
  }
});

module.exports = clazz;