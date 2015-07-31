var React = require('react');
var ImmutableRenderMixin = require('react-immutable-render-mixin');

var ReactLayeredComponentMixin = {

  componentWillUnmount: function() {
    React.unmountComponentAtNode(this._target);
    document.body.removeChild(this._target);
  },
  componentDidUpdate: function() {
    React.render(this.renderLayer(), this._target);
  },

  componentDidMount: function() {
    this._target = document.createElement('div');
    document.body.appendChild(this._target);
    React.render(this.renderLayer(), this._target);
  }
};

var ReactMixinCompositor = birchpress.react.MixinCompositor;

var clazz = birchpress.provide('brithoncrm.subscriptions.components.SetPlanForm', {

  __mixins__: [ReactMixinCompositor],

  getReactMixins: function(component) {
    return [ImmutableRenderMixin, ReactLayeredComponentMixin];
  },

  propTypes: {
    plans: React.PropTypes.array,
    currentPlanDesc: React.PropTypes.string,
    currentPlanMeta: React.PropTypes.string,
    name: React.PropTypes.string,
    value: React.PropTypes.number,
    className: React.PropTypes.string,
    id: React.PropTypes.string,
    radioClassName: React.PropTypes.string,
    radioId: React.PropTypes.string,
    radioOnClick: React.PropTypes.func
  },

  getInitialState: function(component) {
    return {
      shown: false
    };
  },

  render: function(component) {
    var PlanLabel = require('./PlanLabel');

    return (
      <div>
        <PlanLabel description={ component.props.currentPlanDesc } metainfo={ component.props.currentPlanMeta } />
        <a href="javascript:;">See plans and upgrade or downgrade</a>
      </div>
      );
  },

  renderLayer: function(component) {
    if (!component.state.shown) {
      return <span />;
    }
    var Radio = require('./Radio');

    var formRows = [];
    for (plan in component.props.plans) {
      formRows.push(
        <Radio
               description={ plan.description }
               value={ plan.id }
               name={ component.props.name }
               id={ component.props.radioId }
               className={ component.props.radioClassName }
               onClick={ component.props.radioOnClick }
        />
      );
    }

    return ({
      formRows
    });
  },

  handleClick: function(component, event) {
    component.setState({
      shown: !component.state.shown
    });
  }
});

module.exports = clazz;