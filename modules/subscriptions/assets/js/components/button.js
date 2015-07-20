var React = require('react');

var ns = birchpress.namespace('brithoncrm.subscriptions.components.button', {

    getComponentClass: function() {
        var _button = React.createClass({

            propTypes: {
                type: React.PropTypes.string,
                id: React.PropTypes.string,
                className: React.PropTypes.string,
                text: React.PropTypes.string,
                onClick: React.PropTypes.func
            },

            render: function() {
                return ns.render(this);
            },

            handleClick: function(e) {
                return ns.handleClick(this, e);
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
                onClick={ component.props.onClick }
            >{ component.props.text }</button>
        );
    },

    handleClick: function(component, event) {
        event.preventDefault();
        component.props.onClick();
    }
});

module.exports = ns;