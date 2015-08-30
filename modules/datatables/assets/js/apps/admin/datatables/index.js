'use strict';
var React = require('react');
var Immutable = require('immutable');
var birchpress = require('birchpress');

var dataTableComponent;

var ns = birchpress.provide('brithoncrm.datatables.apps.admin.datatables', {

  __init__: function() {
    birchpress.addAction('birchpress.initFrameworkAfter', ns.run);
  },

  run: function() {
    var dataTableDemo = require('brithoncrm/datatables/components/admin/datatables/DataTableDemo');
    var dataTableContainer = document.getElementById('datatabledemo');

    if (!dataTableComponent && dataTableContainer) {
      dataTableComponent = React.render(
        React.createElement(dataTableDemo, {
        }),
        dataTableContainer
      );
    }
  }
});

module.exports = ns;
