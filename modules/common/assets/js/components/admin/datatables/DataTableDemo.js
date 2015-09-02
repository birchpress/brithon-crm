'use strict';
var React = require('react');
var ImmutableRenderMixin = require('react-immutable-render-mixin');
var birchpress = require('birchpress');

var ReactMixinCompositor = birchpress.react.MixinCompositor;

var clazz = birchpress.provide('brithoncrm.common.components.admin.datatables.DataTableDemo', {

  __mixins__: [ReactMixinCompositor],

  getReactMixins: function(component) {
    return [ImmutableRenderMixin];
  },

  propTypes: {
    id: React.PropTypes.string
  },

  render: function(component) {
    var DataTable = require('brithoncrm/common/components/common/DataTable');
    var columns = [
      {
        title: 'Name',
        searchable: true,
        orderable: true
      },
      {
        title: 'Position',
        searchable: true,
        orderable: false
      },
      {
        title: 'Office',
        searchable: true,
        orderable: false
      },
      {
        title: 'Extn.',
        searchable: false,
        orderable: true,
        type: 'num'
      },
      {
        title: 'Start Date',
        searchable: false,
        orderable: false,
        type: 'date'
      },
      {
        title: 'Salary',
        searchable: false,
        orderable: true,
        type: 'num-fmt'
      }
    ];
    var postData = {
      action: 'load_data'
    };
    var options = {};

    return (<DataTable
                       id="example"
                       options={ options }
                       columns={ columns }
                       dataSrcType="server"
                       ajaxUrl={ bp_props.ajax_url }
                       ajaxPost={ true }
                       ajaxFormData={ postData } />);
  }
});

module.exports = clazz;
