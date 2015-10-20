'use strict';

var React = require('react');
var ImmutableRenderMixin = require('react-immutable-render-mixin');
var birchpress = require('birchpress');

var ReactMixinCompositor = birchpress.react.MixinCompositor;

var clazz = birchpress.provide('brithoncrm.subscriptions.components.admin.subscriptions.SetCreditCardForm', {

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
    shown: React.PropTypes.bool,
    handleSwitch: React.PropTypes.func
  },

  handleClick: function(component) {
    return component.props.handleSwitch(component, 'SetCreditCardForm');
  },

  renderLayer: function(component) {
    var StripeControl = require('brithoncrm/subscriptions/components/common/StripeControl');
    var handler = StripeCheckout.configure({
      key: 'pk_test_UXg1SpQF3oMNygpdyln3cokz',
      image: '/img/documentation/checkout/marketplace.png',
      token: function(token) {
        component.props.onUpdateCard(token.id);
      }
    });
    var inProgressMessage;

    if (component.props.inProcess === undefined && !component.props.shown) {
      return <span />;
    }

    if (component.props.inProcess === undefined) {
      inProgressMessage = '';
    } else if (component.props.inProcess === false) {
      component.props.inProcess = undefined;
      inProgressMessage = '';
    } else {
      inProgressMessage = component.__('Processing...');
    }

    return (
      <div>
        <h4>{ component.__('Change or update your credit card') }</h4>
        <form method="POST" id="set-credit-card-form">
          <div>
            <p>
              { component.__('Changes to your credit card will be effective immediately.') }
              <br />
              { component.__('All future charges will be charged to this card.') }
              <br />
              { component.__('Thanks for updating your billing information.') }
            </p>
            <p>
              <StripeControl handler={ handler } __={ component.__ } />&nbsp;
              { inProgressMessage }&nbsp;
              <a href="javascript:;" onClick={ component.handleClick }>
                { component.__('Hide') }
              </a>
            </p>
          </div>
        </form>
      </div>
      );
  },

  render: function(component) {
    var CreditCardLabel = require('brithoncrm/subscriptions/components/common/CreditCardLabel');
    var setCreditCardForm = component.renderLayer();

    return (
      <div id="set-credit-card-div">
        <CreditCardLabel cardnum={ component.props.currentCardNo } __={ component.__ } />
        <a
           id="set-card-link"
           href="javascript:;"
           onClick={ component.handleClick }>
          { component.__('Change your credit card and billing information') }
        </a>
        { setCreditCardForm }
      </div>
      );
  },

  __: function(component, string) {
    return component.props.__(string);
  }
});

module.exports = clazz;
