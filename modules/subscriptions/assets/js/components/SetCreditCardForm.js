var React = require('react');
var ImmutableRenderMixin = require('react-immutable-render-mixin');

var ReactMixinCompositor = birchpress.react.MixinCompositor;

var clazz = birchpress.provide('brithoncrm.subscriptions.components.SetCreditCardForm', {

  __mixins__: [ReactMixinCompositor],

  getReactMixins: function(component) {
    return [ImmutableRenderMixin];
  },

  propTypes: {
    currentCardNo: React.PropTypes.string,
    userEmail: React.PropTypes.string,
    name: React.PropTypes.string,
    className: React.PropTypes.string,
    id: React.PropTypes.string,
  },

  handleClick: function(component) {
    component.setState({
      shown: !component.state.shown,
    });
    var setPlanLink = document.getElementById('set-card-link');
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
    var Button = require('./Button');
    return (
      <div>
        <h4>Change or update your credit card</h4>
        <div>
          <form method="POST">
            <script
                    src="https://checkout.stripe.com/checkout.js"
                    class="stripe-button"
                    data-key="pk_test_UXg1SpQF3oMNygpdyln3cokz"
                    data-image="/img/documentation/checkout/marketplace.png"
                    data-name="Brithon Inc."
                    data-email={ component.props.userEmail }
                    data-label="Update"
                    data-description="Update your credit card">
            </script>
          </form>
        </div>
        <div>
          <p>
            Changes to your credit card will be effective immediately. All future
            <br /> charges will be charged to this card. Thanks for updating your billing
            <br /> info.
          </p>
          <p>
            <Button type="" text="Update my credit card" />&nbsp;&nbsp;
            <a href="javascript:;" onClick={ component.handleClick }>Hide</a>
          </p>
        </div>
      </div>
      );
  },

  render: function(component) {
    var CreditCardLabel = require('./CreditCardLabel');

    return (
      <div id="set-credit-card-form">
        <CreditCardLabel cardnum={ component.props.currentCardNo } />
        <a
           id="set-card-link"
           href="javascript:;"
           onClick={ component.handleClick }>Change your credit card and billing information</a>
      </div>
      );
  },

  componentDidMount: function(component) {
    component.setState({
      shown: false,
    });
    formDiv = document.createElement('div');
    component.props._target = document.getElementById('set-credit-card-form').appendChild(formDiv);
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
