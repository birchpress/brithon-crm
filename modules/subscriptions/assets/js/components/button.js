var React = require('react');

var ns = birchpress.namespace('brithoncrm.subscriptions.components.button', {

    getComponentClass: function() {
        var _button = React.createClass({

            propTypes: {
                type: React.PropTypes.string,
                id: React.PropTypes.string,
                className: React.PropTypes.string,
                text: React.PropTypes.string
            },

            render: function() {
                return ns.render(this);
            }
        });
        return _button;
    },

    render: function(component) { 
        return (
            <button
                type={ component.props.type }
                id={ component.props.id }
                className={ component.props.className }
            >{ component.props.text }</button>
        );
    }
});

module.exports = ns;