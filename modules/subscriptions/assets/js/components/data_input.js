var React = require('react');

var ns = birchpress.namespace('brithoncrm.subscriptions.components.data_input', {

    getComponentClass: function() {
        var _input = React.createClass({

            propTypes: {
                type: React.PropTypes.string,
                name: React.PropTypes.string,
                id: React.PropTypes.string,
                className: React.PropTypes.string,
                placeholder: React.PropTypes.string,
                value: React.PropTypes.string
            },

            getInitialState: function() {
                return ns.getInitialState(this);
            },

            render: function() {
                return ns.render(this);
            }
        });
        return _input;
    },
    
    getInitialState: function(component) {
        return {
            value: component.props.value || ''
        };
    },

    render: function(component) { 
        return (
            <input
                type={ component.props.type }
                name={ component.props.name }
                id={ component.props.id }
                className={ component.props.className }
                placeholder={ component.props.placeholder }
                value={ component.props.value }
            />
        );
    }
});

module.exports = ns;