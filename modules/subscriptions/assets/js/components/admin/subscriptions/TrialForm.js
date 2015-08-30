'use strict';
var React = require('react');
var ImmutableRenderMixin = require('react-immutable-render-mixin');
var birchpress = require('birchpress');

var ReactMixinCompositor = birchpress.react.MixinCompositor;

var clazz = birchpress.provide('brithoncrm.subscriptions.components.admin.subscriptions.TrialForm', {

  __mixins__: [ReactMixinCompositor],

  getReactMixins: function(component) {
    return [ImmutableRenderMixin];
  },

  propTypes: {
    plansFetcher: React.PropTypes.func,
    name: React.PropTypes.string,
    className: React.PropTypes.string,
    id: React.PropTypes.string,
    radioClassName: React.PropTypes.string,
    radioId: React.PropTypes.string,
    radioOnChange: React.PropTypes.func,
    onUpdateCard: React.PropTypes.func,
    onSubmitClick: React.PropTypes.func
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

  handleChange: function(component, event) {
    component.props.value = event.target.value;
    return component.props.radioOnChange(component, event);
  },

  renderLayer: function(component) {
    var Radio = require('brithoncrm/subscriptions/components/common/Radio');
    var Button = require('brithoncrm/subscriptions/components/common/Button');

    var StripeControl = require('brithoncrm/subscriptions/components/common/StripeControl');
    var handler = StripeCheckout.configure({
      key: 'pk_test_UXg1SpQF3oMNygpdyln3cokz',
      image: '/img/documentation/checkout/marketplace.png',
      token: function(token) {
        component.props.onUpdateCard(token.id, token.email);
      }
    });

    var formRows = [];
    var allPlans = component.props.plansFetcher();
    if (!component.state.shown) {
      return <span />;
    }
    for (var key in allPlans) {
      formRows.push(
        <p>
          <Radio
                 desc={ allPlans[key].desc }
                 value={ allPlans[key].id }
                 name={ component.props.name }
                 id={ component.props.radioId }
                 className={ component.props.radioClassName }
                 onChange={ component.props.radioOnChange } />
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
        <Button
                type=""
                text="Purchase"
                onClick={ component.props.onSubmitClick } />&nbsp;&nbsp;
        <a href="javascript:;" onClick={ component.handleClick }>Hide</a>
      </div>
      );
  },

  render: function(component) {
    var PlanLabel = require('brithoncrm/subscriptions/components/common/PlanLabel');
    var _meta = 'You are currently on a trial subscription. Your trial runs until' + component.props.expire_date;
    var trialForm = component.renderLayer();

    return (
      <div id="set-plan-form">
        <PlanLabel description='Trial' metainfo={ _meta } />
        <a
           id="set-plan-link"
           href="javascript:;"
           onClick={ component.handleClick }>Buy subscription</a>
        { trialForm }
      </div>
      );
  }
});

module.exports = clazz;
