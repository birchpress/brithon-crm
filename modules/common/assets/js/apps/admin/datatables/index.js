'use strict';
var React = require('react');
var Immutable = require('immutable');
var birchpress = require('birchpress');

var dataTableComponent = null;

var ns = birchpress.provide('brithoncrm.common.apps.admin.datatables', {

  __init__: function() {
    birchpress.addAction('birchpress.initFrameworkAfter', ns.run);
  },

  run: function() {
    var dataTableDemo = require('brithoncrm/common/components/admin/datatables/DataTableDemo');
    var dataTableContainer = document.getElementById('datatabledemo');
    var globalParams = brithoncrm_common_apps_admin_datatables;

    if (!dataTableComponent && dataTableContainer) {
      dataTableComponent = React.render(
        React.createElement(dataTableDemo, {
          ajaxUrl: globalParams.ajax_url
        }),
        dataTableContainer
      );
    }
  }
});

module.exports = ns;
