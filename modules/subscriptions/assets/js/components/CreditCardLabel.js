var React = require('react');
var ImmutableRenderMixin = require('react-immutable-render-mixin');

var ReactMixinCompositor = birchpress.react.MixinCompositor;

var clazz = birchpress.provide('brithoncrm.subscriptions.components.CreditCardLabel', {

  __mixins__: [ReactMixinCompositor],

  getReactMixins: function(component) {
    return [ImmutableRenderMixin];
  },

  propTypes: {
    cardnum: React.PropTypes.string
  },

  render: function(component) {
    return (
      <div>
        <p>
          <b>Credit card</b>
        </p>
        <p>
          Your credit card on file is
          { component.props.cardnum }
        </p>
      </div>
      );
  }
});

module.exports = clazz;