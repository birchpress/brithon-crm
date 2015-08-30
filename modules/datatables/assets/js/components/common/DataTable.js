'use strict';
var React = require('react');
var ImmutableRenderMixin = require('react-immutable-render-mixin');
var birchpress = require('birchpress');
var jQuery = require('jquery');
var $ = jQuery;

var ReactMixinCompositor = birchpress.react.MixinCompositor;

var clazz = birchpress.provide('brithoncrm.datatables.components.common.DataTable', {

  __mixins__: [ReactMixinCompositor],

  getReactMixins: function(component) {
    return [ImmutableRenderMixin];
  },

  propTypes: {
    id: React.PropTypes.string
  },

  renderDataTable: function(component, props) {
    var properties = props || component.props;
    var tableId = properties.id ? properties.id : 'dataTable';
    React.render(<table
                        id={ tableId }
                        className="display"
                        cellSpacing="0"
                        width="100%">
                 </table>, component.getDOMNode());
    $(document).ready(function() {
      $('#' + tableId).dataTable(properties.options);
    });
  },

  componentDidMount: function(component) {
    component.renderDataTable();
  },

  componentWillReceiveProps: function(component, newProps) {
    component.renderDataTable(newProps);
  },

  render: function(component) {
    return <div />;
  }
});

module.exports = clazz;
