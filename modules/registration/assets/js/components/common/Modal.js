'use strict';

var React = require('react');
var birchpress = require('birchpress');

var clazz = birchpress.provide('brithoncrm.registration.components.common.Modal', {

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
  }
});

module.exports = clazz;
