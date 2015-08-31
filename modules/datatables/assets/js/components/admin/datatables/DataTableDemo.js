'use strict';
var React = require('react');
var ImmutableRenderMixin = require('react-immutable-render-mixin');
var birchpress = require('birchpress');

var ReactMixinCompositor = birchpress.react.MixinCompositor;

var clazz = birchpress.provide('brithoncrm.datatables.components.admin.datatables.DataTableDemo', {

  __mixins__: [ReactMixinCompositor],

  getReactMixins: function(component) {
    return [ImmutableRenderMixin];
  },

  propTypes: {
    id: React.PropTypes.string
  },

  render: function(component) {
    var DataTable = require('brithoncrm/datatables/components/common/DataTable');
    var options = {
      serverSide: true,
      ajax: {
        url: bp_props.ajax_url,
        type: 'POST',
        data: {
          action: 'load_data'
        }
      },
      columns: [
        {
          title: 'Name'
        },
        {
          title: 'Position'
        },
        {
          title: 'Office'
        },
        {
          title: 'Extn.'
        },
        {
          title: 'Start Date'
        },
        {
          title: 'Salary'
        }
      ]
    };
    return <DataTable id="example" options={ options } />;
  }
});

module.exports = clazz;
