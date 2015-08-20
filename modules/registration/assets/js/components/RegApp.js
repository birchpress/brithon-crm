'use strict';
var React = require('react/addons');
var ImmutableRenderMixin = require('react-immutable-render-mixin');

var Modal = require('./Modal');

var ReactMixinCompositor = birchpress.react.MixinCompositor;

var clazz = birchpress.provide('brithoncrm.registration.components.RegApp', {

  __mixins__: [ReactMixinCompositor],

  getReactMixins: function(component) {
    return [ImmutableRenderMixin];
  },

  handleClick: function(component) {
    component.props.shown = !component.props.shown;
    if (component.props.shown) {
      component.props._target = document.createElement('div');
      document.body.appendChild(component.props._target);
      React.render(component.renderLayer(), component.props._target);
    } else {
      React.unmountComponentAtNode(component.props._target);
      document.removeChild(component.props._target);
    }
  },

  getInitialState: function(component) {
    return {
      shown: false,
      modalShown: false
    };
  },

  renderLayer: function(component) {
    if (!component.props.shown) {
      return <span />;
    }
    var Button = require('./Button');
    var Input = require('./DataInput');
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
    return (<a
               href="javascript:;"
               role="button"
               onClick={ component.handleClick }>Click here to register</a>);
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
