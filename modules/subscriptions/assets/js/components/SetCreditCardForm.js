'use strict';
var React = require('react');
var ImmutableRenderMixin = require('react-immutable-render-mixin');

var ReactMixinCompositor = birchpress.react.MixinCompositor;

var clazz = birchpress.provide('brithoncrm.subscriptions.components.SetCreditCardForm', {

  __mixins__: [ReactMixinCompositor],

  getReactMixins: function(component) {
    return [ImmutableRenderMixin];
  },

  propTypes: {
    currentCardNo: React.PropTypes.string,
    userEmail: React.PropTypes.string,
    name: React.PropTypes.string,
    className: React.PropTypes.string,
    id: React.PropTypes.string,
    shown: React.PropTypes.bool
  },

  handleClick: function(component) {
    component.props.shown = !component.props.shown;
    if (component.props.shown) {
      var formDiv = document.createElement('div');
      component.props._target = document.getElementById('set-credit-card-div').appendChild(formDiv);
      React.render(component.renderLayer(), component.props._target);
    } else {
      React.unmountComponentAtNode(component.props._target);
      document.removeChild(component.props._target);
    }
  },

  renderLayer: function(component) {
    if (!component.props.shown) {
      return <span />;
    }
    var StripeControl = require('./stripecontrol');
    var handler = StripeCheckout.configure({
      key: 'pk_test_UXg1SpQF3oMNygpdyln3cokz',
      image: '/img/documentation/checkout/marketplace.png',
      token: function(token) {
        component.props.onUpdateCard(token.id);
      }
    });
    return (
      <div>
        <h4>Change or update your credit card</h4>
        <form method="POST" id="set-credit-card-form">
          <div>
            <p>
              Changes to your credit card will be effective immediately. All future
              <br /> charges will be charged to this card. Thanks for updating your billing
              <br /> info.
            </p>
            <p>
              <StripeControl handler={ handler } />&nbsp;
              <a href="javascript:;" onClick={ component.handleClick }>Hide</a>
            </p>
          </div>
        </form>
      </div>
      );
  },

  render: function(component) {
    var CreditCardLabel = require('./CreditCardLabel');

    return (
      <div id="set-credit-card-div">
        <CreditCardLabel cardnum={ component.props.currentCardNo } />
        <a
           id="set-card-link"
           href="javascript:;"
           onClick={ component.handleClick }>Change your credit card and billing information</a>
      </div>
      );
  }
});

module.exports = clazz;
