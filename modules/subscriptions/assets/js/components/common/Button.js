'use strict';

var React = require('react');
var birchpress = require('birchpress');

var clazz = birchpress.provide('brithoncrm.subscriptions.components.common.Button', {

  propTypes: {
    type: React.PropTypes.string,
    id: React.PropTypes.string,
    className: React.PropTypes.string,
    text: React.PropTypes.string,
    onClick: React.PropTypes.func
  },

  render: function(component) {
    return (
      <button
              type={ component.props.type }
              id={ component.props.id }
              className={ component.props.className }
              onClick={ component.props.onClick }>
        { component.props.text }
      </button>
      );
  },

  handleClick: function(component, event) {
    event.preventDefault();
    return component.props.onClick();
  }
});

module.exports = clazz;
