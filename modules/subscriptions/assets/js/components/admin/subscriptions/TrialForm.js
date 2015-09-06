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
    var inProgressMessage;

    if (component.props.inProcess === undefined && !component.state.shown) {
      return <span />;
    }
    if (!allPlans) {
      formRows.push(<p>
                      { component.__('Please wait while plans list is loading...') }
                    </p>);
    }

    if (component.props.inProcess === undefined) {
      inProgressMessage = '';
    } else if (component.props.inProcess === false) {
      component.props.inProcess = undefined;
      inProgressMessage = '';
    } else {
      inProgressMessage = component.__('Processing...');
    }

    for (var key in allPlans) {
      formRows.push(
        <p>
          <Radio
                 desc={ component.__(allPlans[key].desc) }
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
        <h4>{ component.__('Choose plan') }</h4>
        { formRows }
        <h4>{ component.__('Credit card') }</h4>
        <form method="POST">
          <StripeControl handler={ handler } __={ component.props.__ } />
        </form>
        <Button
                type=""
                text={ component.__('Purchase') }
                onClick={ component.props.onSubmitClick } />&nbsp;
        { inProgressMessage }&nbsp;
        <a href="javascript:;" onClick={ component.handleClick }>
          { component.__('Hide') }
        </a>
      </div>
      );
  },

  render: function(component) {
    var PlanLabel = require('brithoncrm/subscriptions/components/common/PlanLabel');
    var _meta = component.__('You are currently on a trial subscription.');
    var trialForm = component.renderLayer();

    return (
      <div id="set-plan-form">
        <PlanLabel
                   description={ component.__('Trial') }
                   metainfo={ component.__(_meta) }
                   __={ component.__ } />
        <a
           id="set-plan-link"
           href="javascript:;"
           onClick={ component.handleClick }>
          { component.__('Buy subscription') }
        </a>
        { trialForm }
      </div>
      );
  },

  __: function(component, string) {
    return component.props.__(string);
  }
});

module.exports = clazz;
