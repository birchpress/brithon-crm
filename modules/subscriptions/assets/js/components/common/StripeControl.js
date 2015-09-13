'use strict';

var React = require('react');
var birchpress = require('birchpress');

var clazz = birchpress.provide('brithoncrm.subscriptions.components.common.StripeControl', {

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
                     text={ component.__('Update My Card') }
                     onClick={ component.handleClick } />
           </div>;
  },

  __: function(component, string) {
    return component.props.__(string);
  }
});

module.exports = clazz;