'use strict';

var React = require('react');
var ImmutableRenderMixin = require('react-immutable-render-mixin');
var birchpress = require('birchpress');

var ReactMixinCompositor = birchpress.react.MixinCompositor;

var Modal = require('brithoncrm/registration/components/common/Modal');

var clazz = birchpress.provide('brithoncrm.registration.components.front.registration.RegistrationPanel', {

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
    var store = component.props.store;
    if (!component.state.shown) {
      return <span />;
    }
    return (
      <Modal onRequestClose={ component.handleClick }>
        <h2>{ component.__('Welcome to register') }</h2>
        <form>
          <div className="row">
            <Input
                   type="text"
                   name="first_name"
                   id=""
                   className="width-1-2"
                   placeholder={ component.__('First Name') }
                   value={ store.getCursor().get('first_name') }
                   onChange={ component.handleChange } />
            <Input
                   type="text"
                   name="last_name"
                   id=""
                   className="width-1-2"
                   placeholder={ component.__('Last Name') }
                   value={ store.getCursor().get('last_name') }
                   onChange={ component.handleChange } />
          </div>
          <div className="row">
            <Input
                   type="text"
                   name="email"
                   id=""
                   className=""
                   placeholder={ component.__('Email address') }
                   value={ store.getCursor().get('email') }
                   onChange={ component.handleChange } />
          </div>
          <div className="row">
            <Input
                   type="text"
                   name="org"
                   id=""
                   className="width-1-1"
                   placeholder={ component.__('Organization') }
                   value={ store.getCursor().get('org') }
                   onChange={ component.handleChange } />
          </div>
          <div className="row">
            <Input
                   type="password"
                   name="password"
                   id=""
                   className="width-1-1"
                   placeholder={ component.__('Password') }
                   value={ store.getCursor().get('password') }
                   onChange={ component.handleChange } />
          </div>
          <div className="row align-center">
            <Button
                    type="submit"
                    id=""
                    className=""
                    text={ component.__('Submit') }
                    onClick={ component.buttonClick } />
            <Button
                    type="reset"
                    id=""
                    className=""
                    text={ component.__('Reset') } />
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
                 onClick={ component.handleClick }>
                { component.__('Register') }
              </a>
              { registerForm }
            </div>);
  },

  buttonClick: function(component, event) {
    event.preventDefault();
    component.submit();
  },

  inputData: function(component, name, value) {
    if (component.props.data === undefined) {
      component.props.data = {};
    }
    component.props.data[name] = value;
  },

  handleChange: function(component, childComponent, event) {
    //component.props.store.insert(childComponent.props.name, childComponent.props.value);
    component.inputData(childComponent.props.name, childComponent.props.value);
  },

  submit: function(component) {
    var data = component.props.data;
    for (var name in data) {
      component.props.store.insert(name, data[name]);
    }
    component.props.store.submit();
  },

  __: function(component, string) {
    var i18n = component.props.i18n;
    return i18n.getText(string);
  }

});

module.exports = clazz;
