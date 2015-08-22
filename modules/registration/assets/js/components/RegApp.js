'use strict';
var React = require('react/addons');
var ImmutableRenderMixin = require('react-immutable-render-mixin');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Modal = require('./Modal');

var ReactMixinCompositor = birchpress.react.MixinCompositor;

var clazz = birchpress.provide('brithoncrm.registration.components.RegApp', {

  __mixins__: [ReactMixinCompositor],

  getReactMixins: function(component) {
    return [ImmutableRenderMixin];
  },

  handleClick: function(component) {
    component.setProps({
      shown: !component.props.shown
    });
  },

  renderLayer: function(component) {
    var Button = require('./Button');
    var Input = require('./DataInput');
    if (!component.props.shown) {
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
