'use strict';
var React = require('react/addons');
var ImmutableRenderMixin = require('react-immutable-render-mixin');
var birchpress = require('birchpress');

var Modal = require('brithoncrm/registration/components/common/Modal');

var ReactMixinCompositor = birchpress.react.MixinCompositor;

var clazz = birchpress.provide('brithoncrm.registration.components.front.registration.RegistrationApp', {

  __mixins__: [ReactMixinCompositor],

  getReactMixins: function(component) {
    return [ImmutableRenderMixin];
  },

  handleClick: function(component) {
    component.setState({
      shown: !component.state.shown
    });
  },

  getInitialState: function(component) {
    return {
      shown: false
    };
  },

  renderLayer: function(component) {
    var Button = require('brithoncrm/registration/components/common/Button');
    var Input = require('brithoncrm/registration/components/common/DataInput');
    if (!component.state.shown) {
      return <span />;
    }
    return (
      <Modal onRequestClose={ component.handleClick }>
        <h1>Welcome to register!</h1>
        <form>
          <div className="row">
            <Input
                   type="text"
                   name="first_name"
                   id=""
                   className="width-1-2"
                   placeholder="First Name"
                   onChange={ component.handleChange } />
            <Input
                   type="text"
                   name="last_name"
                   id=""
                   className="width-1-2"
                   placeholder="Last Name"
                   onChange={ component.handleChange } />
          </div>
          <div className="row">
            <Input
                   type="text"
                   name="email"
                   id=""
                   className=""
                   placeholder="Email address"
                   onChange={ component.handleChange } />
          </div>
          <div className="row">
            <Input
                   type="text"
                   name="org"
                   id=""
                   className="width-1-1"
                   placeholder="Organization"
                   onChange={ component.handleChange } />
          </div>
          <div className="row">
            <Input
                   type="password"
                   name="password"
                   id=""
                   className="width-1-1"
                   placeholder="Password"
                   onChange={ component.handleChange } />
          </div>
          <div className="row align-center">
            <Button
                    type="submit"
                    id=""
                    className=""
                    text="Submit"
                    onClick={ component.buttonClick } />
            <Button
                    type="reset"
                    id=""
                    className=""
                    text="Reset" />
          </div>
        </form>
      </Modal>
      );
  },

  render: function(component) {
    var registerForm = component.renderLayer();
    return (<div id="reg" key="regdiv">
              <a
                 href="javascript:;"
                 role="button"
                 key="reglink"
                 onClick={ component.handleClick }>Click here to register</a>
              { registerForm }
            </div>);
  },

  buttonClick: function(component, event) {
    event.preventDefault();
    component.submit();
  },

  handleChange: function(component, childComponent, event) {
    component.props.store.insert(childComponent.props.name, childComponent.props.value);
  },

  submit: function(component) {
    component.props.store.submit();
  }
});

module.exports = clazz;
