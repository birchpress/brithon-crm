'use strict';
var Immutable = require('immutable');
var Cursor = require('immutable/contrib/cursor');
var birchpress = require('birchpress');
var PO = require('pofile');
var ImmutableStore = birchpress.stores.ImmutableStore;

var clazz = birchpress.provide('brithoncrm.common.stores.i18nStores', {

  __mixins__: [ImmutableStore],

  __construct__: function(self, data) {
    ImmutableStore.__construct__(self, data);
  },

  loadPO: function(self, poString) {
    var textDomain = birchpress_i18n.textDomain;
    var locale = birchpress_i18n.locale;
    var po = PO.parse(poString);
    var result = {};

    if (po.items) {
      for (var id in po.items) {
        var item = po.items[id];
        var key = item.msgid.replace(/ /g, '_');
        result[key] = item.msgstr;
      }
    }
    self.getCursor().set('translations', result);
  },

  getText: function(self, string) {
    var translations = self.getCursor().get('translations');
    var key = string.replace(/ /g, '_');
    if (!translations || !translations[key]) {
      return string;
    }
    return translations[key].toString();
  }

});

module.exports = clazz;

