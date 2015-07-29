var React = require('react');
var Immutable = require('immutable');

var SubStore = require('./stores/substore.js')

var regAppComponent;

var ns = birchpress.provide('brithoncrm.subscriptions', {

    __init__: function() {
        birchpress.addAction('brithoncrm.subscriptions.initModuleAfter', ns.run);
    },

    initModule: function() {
        birchpress.initNamespace(brithoncrm.subscriptions);
    },

    run: function() {
        var regApp = require('./components/regapp');
        var regData = Immutable.fromJS({});
        if (!regAppComponent) {
            var store = SubStore(regData);
            regAppComponent = React.render(
                React.createElement(regApp, {
                    store: store,
                    cursor: store.getCursor()
                }),
                document.getElementById('registerapp')
            );
            store.setAttr('component', regAppComponent);
            birchpress.addAction('brithoncrm.subscriptions.stores.SubStore.onChangeAfter', function(store, newCursor) {
                store.getAttr('component').setProps({
                    store: store,
                    cursor: newCursor
                });
            });
        }
    }
});
birchpress.addAction('birchpress.initFrameworkAfter', ns.initModule);
module.exports = ns;
