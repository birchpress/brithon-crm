var React = require('react/addons');

var Modal = require('./modal').getComponentClass();

var ReactLayeredComponentMixin = {

    componentWillUnmount: function() {
        this._unrenderLayer();
        document.body.removeChild(this._target);
    },
    componentDidUpdate: function() {
        this._renderLayer();
    },
    
    componentDidMount: function() {
        // Appending to the body is easier than managing the z-index of everything on the page.
        // It's also better for accessibility and makes stacking a snap (since components will stack
        // in mount order).
        this._target = document.createElement('div');
        document.body.appendChild(this._target);
        this._renderLayer();
    },
    
    _renderLayer: function() {
        // By calling this method in componentDidMount() and componentDidUpdate(), you're effectively
        // creating a "wormhole" that funnels React's hierarchical updates through to a DOM node on an
        // entirely different part of the page.
        React.render(this.renderLayer(), this._target);
    },
    
    _unrenderLayer: function() {
        React.unmountComponentAtNode(this._target);
    }
};

var ns = birchpress.namespace('brithoncrm.test.components.testapp', {

    getComponentClass: function() {
        var testMod = React.createClass({

            mixins: [ReactLayeredComponentMixin],

            handleClick: function() {
                return ns.handleClick(this);
            },

            getInitialState: function() {
                return ns.getInitialState(this);
            },

            componentDidMount: function() {
                return ns.componentDidMount(this);
            },

            renderLayer: function() {
                return ns.renderLayer(this);
            },

            render: function() {
                return ns.render(this);
            }
        });
        return testMod;
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

    componentDidMount: function(component) {
    
    },

    renderLayer: function(component) {
        if (!component.state.shown) {
            return <span />;
        }
        var Button = require('./button').getComponentClass();
        var Input = require('./data_input').getComponentClass();
        return (
            <Modal onRequestClose={component.handleClick} >
                <h1>Welcome to register!</h1>
                <form>
                    <div className="row">
                        <Input type="text" name="first_name" id="" className="width-1-2" placeholder="First Name" />
                        <Input type="text" name="last_name" id="" className="width-1-2" placeholder="Last Name" />
                    </div>
                    <div className="row">
                        <Input type="text" name="email" id="" className="" placeholder="Email address" />
                    </div>
                    <div className="row">
                        <Input type="text" name="organization" id="" className="width-1-1" placeholder="Organization" />
                    </div>
                    <div className="row">
                        <Input type="password" name="password" id="" className="width-1-1" placeholder="Password" />
                    </div>
                    <div className="row align-center">
                        <Button type="submit" id="" className="" text="Submit" />
                        <Button type="reset" id="" className="" text="Reset" />
                    </div> 
                </form>
            </Modal>
        );
    },

    render: function(component){
        return <a href="javascript:;" role="button" onClick={component.handleClick}>Click here to register</a>;
    }
});

module.exports = ns;