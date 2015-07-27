var React = require('react/addons');

var Modal = require('./modal');
var stores = require('../stores');
var actions = require('../actions');

var ReactLayeredComponentMixin = {

    componentWillUnmount: function() {
        React.unmountComponentAtNode(this._target);
        document.body.removeChild(this._target);
    },
    componentDidUpdate: function() {
        React.render(this.renderLayer(), this._target);
    },
    
    componentDidMount: function() {
        // Appending to the body is easier than managing the z-index of everything on the page.
        // It's also better for accessibility and makes stacking a snap (since components will stack
        // in mount order).
        this._target = document.createElement('div');
        document.body.appendChild(this._target);
        React.render(this.renderLayer(), this._target);
    }
};

var ReactMixinCompositor = birchpress.react.MixinCompositor;

var clazz = birchpress.provide('brithoncrm.subscriptions.components.regapp', {

    __mixins__: [ReactMixinCompositor],

    getReactMixins: function(component) {
        return [ReactLayeredComponentMixin];
    },

    propTypes: {
        first_name: React.PropTypes.string,
        last_name: React.PropTypes.string,
        email: React.PropTypes.string,
        password: React.PropTypes.string,
        org: React.PropTypes.string
    },

    handleClick: function(component) {
        component.setState({
            shown: !component.state.shown
        });
    },

    getInitialState: function(component) {
        return {
            shown: false, 
            modalShown: false
        };
    },

    renderLayer: function(component) {
        if (!component.state.shown) {
            return <span />;
        }
        var Button = require('./button');
        var Input = require('./data_input');
        return (
            <Modal onRequestClose={component.handleClick} >
                <h1>Welcome to register!</h1>
                <form>
                    <div className="row">
                        <Input type="text" name="first_name" id="" className="width-1-2" placeholder="First Name" onChange={ component.handleChange } />
                        <Input type="text" name="last_name" id="" className="width-1-2" placeholder="Last Name" onChange={ component.handleChange } />
                    </div>
                    <div className="row">
                        <Input type="text" name="email" id="" className="" placeholder="Email address" onChange={ component.handleChange } />
                    </div>
                    <div className="row">
                        <Input type="text" name="organization" id="" className="width-1-1" placeholder="Organization" onChange={ component.handleChange } />
                    </div>
                    <div className="row">
                        <Input type="password" name="password" id="" className="width-1-1" placeholder="Password" onChange={ component.handleChange } />
                    </div>
                    <div className="row align-center">
                        <Button type="submit" id="" className="" text="Submit" onClick={ component.buttonClick } />
                        <Button type="reset" id="" className="" text="Reset" />
                    </div>  
                </form>

            </Modal>
        );
    },

    render: function(component){
        return <a href="javascript:;" role="button" onClick={component.handleClick}>Click here to register</a>;
    },

    buttonClick: function(component, event){
        event.preventDefault();

        actions.submit(
            component.props.first_name,
            component.props.last_name,
            component.props.email,
            component.props.org,
            component.props.password
        );
    },

    handleChange: function(component, childComponent, event) {
        switch(childComponent.props.name){
            case 'first_name':
            component.setProps({first_name: childComponent.props.value});
            break;

            case 'last_name':
            component.setProps({last_name: childComponent.props.value});
            break;

            case 'email':
            component.setProps({email: childComponent.props.value});
            break;

            case 'organization':
            component.setProps({org: childComponent.props.value});
            break;

            case 'password':
            component.setProps({password: childComponent.props.value});
            break;

            default:
            break;
        }     
        console.log(childComponent.props.value);
    }
});

module.exports = clazz;