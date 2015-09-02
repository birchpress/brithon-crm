'use strict';
var React = require('react');
var ImmutableRenderMixin = require('react-immutable-render-mixin');
var birchpress = require('birchpress');
var jQuery = require('jquery');
var $ = jQuery;

var ReactMixinCompositor = birchpress.react.MixinCompositor;

var clazz = birchpress.provide('brithoncrm.common.components.common.DataTable', {

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
    var tableOptions = component.processOptions(properties);

    React.render(<table id={ tableId }>
                 </table>, component.getDOMNode());

    $(document).ready(function() {
      $('#' + tableId).dataTable(tableOptions);
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
  },

  processOptions: function(component, rawProps) {
    var optionsObject = {};

    // Data-related options
    if (!rawProps.columns) {
      throw 'DataTable properties error: Columns are not specified.';
    }
    optionsObject.columns = rawProps.columns;
    if (!rawProps.dataSrcType) {
      throw 'DataTable properties error: Data Soruce Type (dataSrcType) is not specified';
    }
    optionsObject.serverSide = (rawProps.dataSrcType.toLowerCase() === 'server') ? true : false;
    if (optionsObject.serverSide) {
      var ajaxArgs = {};

      if (!rawProps.ajaxUrl) {
        throw 'DataTable properties error: AJAX URL (ajaxUrl) is not specified as you request server processing';
      }
      ajaxArgs.url = rawProps.ajaxUrl;
      ajaxArgs.type = rawProps.ajaxPost ? 'POST' : 'GET';
      ajaxArgs.data = rawProps.ajaxFormData ? rawProps.ajaxFormData : {};

      optionsObject.ajax = ajaxArgs;
    } else {
      if (rawProps.ajax) {
        optionsObject.ajax = rawProps.ajax;
      }
      if (rawProps.data) {
        optionsObject.data = rawProps.data;
      }
    }
    // Display-related
    optionsObject.info = rawProps.info;
    // Others
    optionsObject = $.extend(optionsObject, rawProps.options);

    return optionsObject;
  }
});

module.exports = clazz;
