var React = require('react');
var ImmutableRenderMixin = require('react-immutable-render-mixin');

var ReactMixinCompositor = birchpress.react.MixinCompositor;

var clazz = birchpress.provide('brithoncrm.subscriptions.components.SetPlanForm', {

  __mixins__: [ReactMixinCompositor],

  getReactMixins: function(component) {
    return [ImmutableRenderMixin];
  },

  propTypes: {
    plans: React.PropTypes.array,
    currentPlanDesc: React.PropTypes.string,
    currentPlanMeta: React.PropTypes.string,
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
        <Button type="" text="Update" />&nbsp;&nbsp;
        <a href="javascript:;" onClick={ component.handleClick }>Hide</a>
      </div>
      );
  },

  render: function(component) {
    var PlanLabel = require('./PlanLabel');

    return (
      <div id="set-plan-form">
        <PlanLabel description={ component.props.currentPlanDesc } metainfo={ component.props.currentPlanMeta } />
        <a
           id="set-plan-link"
           href="javascript:;"
           onClick={ component.handleClick }>See plans and upgrade or downgrade</a>
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
