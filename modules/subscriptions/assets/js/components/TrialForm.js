'use strict';
var React = require('react');
var ImmutableRenderMixin = require('react-immutable-render-mixin');

var ReactMixinCompositor = birchpress.react.MixinCompositor;

var clazz = birchpress.provide('brithoncrm.subscriptions.components.TrialForm', {

  __mixins__: [ReactMixinCompositor],

  getReactMixins: function(component) {
    return [ImmutableRenderMixin];
  },

  propTypes: {
    plans: React.PropTypes.array,
    name: React.PropTypes.string,
    className: React.PropTypes.string,
    id: React.PropTypes.string,
    radioClassName: React.PropTypes.string,
    radioId: React.PropTypes.string,
    radioOnClick: React.PropTypes.func
  },

  handleClick: function(component) {
    component.setState({
      shown: !component.state.shown,
    });
    var setPlanLink = document.getElementById('set-plan-link');
    setPlanLink.hidden = !component.state.shown;
  },

  getInitialState: function(component) {
    return {
      shown: false
    };
  },

  renderLayer: function(component) {
    if (!component.state.shown) {
      return <span />;
    }
    var Radio = require('./Radio');
    var Modal = require('./Modal');
    var Button = require('./Button');

    var StripeControl = require('./stripecontrol');
    var handler = StripeCheckout.configure({
      key: 'pk_test_UXg1SpQF3oMNygpdyln3cokz',
      image: '/img/documentation/checkout/marketplace.png',
      token: function(token) {
        component.props.onUpdateCard(token.id);
      }
    });

    var formRows = [];
    var allPlans = component.props.plans;
    for (var key in allPlans) {
      formRows.push(
        <p>
          <Radio
                 desc={ allPlans[key].desc }
                 value={ allPlans[key].id }
                 name={ component.props.name }
                 id={ component.props.radioId }
                 className={ component.props.radioClassName }
                 onClick={ component.props.onHide } />
        </p>
      );
    }

    return (
      <div>
        <h4>Choose plan</h4>
        { formRows }
        <h4>Credit card</h4>
        <form method="POST">
          <StripeControl handler={ handler } />
        </form>
        <Button type="" text="Purchase" />&nbsp;&nbsp;
        <a href="javascript:;" onClick={ component.handleClick }>Hide</a>
      </div>
      );
  },

  render: function(component) {
    var PlanLabel = require('./PlanLabel');
    var _meta = 'You are currently on a trial subscription. Your trial runs until' + component.props.expire_date;

    return (
      <div id="set-plan-form">
        <PlanLabel description='Trial' metainfo={ _meta } />
        <a
           id="set-plan-link"
           href="javascript:;"
           onClick={ component.handleClick }>Buy subscription</a>
      </div>
      );
  },

  componentDidMount: function(component) {
    component.setState({
      shown: false,
    });
    formDiv = document.createElement('div');
    component.props._target = document.getElementById('set-plan-form').appendChild(formDiv);
  },

  componentDidUpdate: function(component) {
    React.render(component.renderLayer(), component.props._target);
  },

  onHide: function(component) {
    React.unmountComponentAtNode(component.props._target);
    document.removeChild(component.props._target);
  },
});

module.exports = clazz;
