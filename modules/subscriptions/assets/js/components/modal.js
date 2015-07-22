var React = require('react');

var ReactMixinCompositor = birchpress.react.MixinCompositor;

var clazz = birchpress.provide('brithoncrm.subscriptions.components.modal', {

    __mixins__: [ReactMixinCompositor],

    killClick: function(component, event){
        // clicks on the content shouldn't close the modal
        event.stopPropagation();        
    },

    handleBackdropClick: function(component) {
        // when you click the background, the user is requesting that the modal gets closed.
        // note that the modal has no say over whether it actually gets closed. the owner of the
        // modal owns the state. this just "asks" to be closed.
        component.props.onRequestClose();
    },

    render: function(component) {
        return (
            <div { ...component.props } className="ModalBackdrop" onClick={component.handleBackdropClick}>
                <div className="ModalContent" onClick={component.killClick}>
                    {component.props.children}
                </div>
            </div>
        );
    }

});

module.exports = clazz;