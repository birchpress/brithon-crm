'use strict';
var React = require('react');
var ImmutableRenderMixin = require('react-immutable-render-mixin');

var ReactMixinCompositor = birchpress.react.MixinCompositor;

var clazz = birchpress.provide('brithoncrm.subscriptions.components.SetPlanForm', {

  __mixins__: [ReactMixinCompositor],

  getReactMixins: function(component) {
    return [ImmutableRenderMixin];
  },

  propTypes: {
    plansFetcher: React.PropTypes.func,
    currentPlanDesc: React.PropTypes.string,
    currentPlanMeta: React.PropTypes.string,
    name: React.PropTypes.string,
    className: React.PropTypes.string,
    id: React.PropTypes.string,
    radioClassName: React.PropTypes.string,
    radioId: React.PropTypes.string,
    radioOnClick: React.PropTypes.func,
    radioOnChange: React.PropTypes.func,
    onSubmitClick: React.PropTypes.func,
  },

  handleClick: function(component) {
    component.setProps({
      shown: !component.props.shown
    });
  },

  handleChange: function(component, event) {
    component.props.value = event.target.value;
    return component.props.radioOnChange(component, event);
  },

  renderLayer: function(component) {
    var Radio = require('subscriptions/components/common/Radio');
    var Button = require('subscriptions/components/common/Button');

    var formRows = [];
    var allPlans = component.props.plansFetcher();
    if (!component.props.shown) {
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
                 onClick={ component.props.onHide }
                 onChange={ component.props.radioOnChange } />
        </p>
      );
    }

    return (
      <div>
        <h4>Choose plan</h4>
        { formRows }
        <Button
                type=""
                text="Update"
                onClick={ component.props.onSubmitClick } />&nbsp;&nbsp;
        <a href="javascript:;" onClick={ component.handleClick }>Hide</a>
      </div>
      );
  },

  render: function(component) {
    var PlanLabel = require('subscriptions/components/common/PlanLabel');
    var setPlanForm = component.renderLayer();

    return (
      <div id="set-plan-form">
        <PlanLabel description={ component.props.currentPlanDesc } metainfo={ component.props.currentPlanMeta } />
        <a
           id="set-plan-link"
           href="javascript:;"
           onClick={ component.handleClick }>See plans and upgrade or downgrade</a>
        { setPlanForm }
      </div>
      );
  }
});

module.exports = clazz;
