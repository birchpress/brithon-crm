'use strict';
var React = require('react/addons');
var ImmutableRenderMixin = require('react-immutable-render-mixin');
var birchpress = require('birchpress');

var Modal = require('brithoncrm/registration/components/common/Modal');

var ReactMixinCompositor = birchpress.react.MixinCompositor;

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
                   onChange={ component.handleChange } />
            <Input
                   type="text"
                   name="last_name"
                   id=""
                   className="width-1-2"
                   placeholder={ component.__('Last Name') }
                   onChange={ component.handleChange } />
          </div>
          <div className="row">
            <Input
                   type="text"
                   name="email"
                   id=""
                   className=""
                   placeholder={ component.__('Email address') }
                   onChange={ component.handleChange } />
          </div>
          <div className="row">
            <Input
                   type="text"
                   name="org"
                   id=""
                   className="width-1-1"
                   placeholder={ component.__('Organization') }
                   onChange={ component.handleChange } />
          </div>
          <div className="row">
            <Input
                   type="password"
                   name="password"
                   id=""
                   className="width-1-1"
                   placeholder={ component.__('Password') }
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

  handleChange: function(component, childComponent, event) {
    component.props.store.insert(childComponent.props.name, childComponent.props.value);
  },

  submit: function(component) {
    component.props.store.submit();
  },

  __: function(component, string) {
    var tStore = component.props.translationStore;
    return tStore.getText(string);
  }

});

module.exports = clazz;
