'use strict';
var React = require('react');
var ImmutableRenderMixin = require('react-immutable-render-mixin');

var ReactMixinCompositor = birchpress.react.MixinCompositor;

var clazz = birchpress.provide('brithoncrm.subscriptions.components.common.PlanLabel', {

  __mixins__: [ReactMixinCompositor],

  getReactMixins: function(component) {
    return [ImmutableRenderMixin];
  },

  propTypes: {
    description: React.PropTypes.string,
    metainfo: React.PropTypes.string
  },

  render: function(component) {
    return (
      <div>
        <p>
          <b>Current plan:</b>
          { component.props.description }
        </p>
        <p>
          { component.props.metainfo }
        </p>
      </div>
      );
  }
});

module.exports = clazz;