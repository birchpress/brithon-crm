'use strict';

var React = require('react');
var birchpress = require('birchpress');

var clazz = birchpress.provide('brithoncrm.subscriptions.components.CreditCardLabel', {

  propTypes: {
    cardnum: React.PropTypes.string,
  },

  render: function(component) {
    return (
      <div>
        <p>
          <b>{ component.__('Credit card') }</b>
        </p>
        <p>
          { component.__('Your credit card on file is') }&nbsp;
          { component.props.cardnum }
        </p>
      </div>
      );
  },

  __: function(component, string) {
    return component.props.__(string);
  }
});

module.exports = clazz;