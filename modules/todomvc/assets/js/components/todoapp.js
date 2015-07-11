var React = require('react');
var ImmutableRenderMixin = require('react-immutable-render-mixin')

var ns = birchpress.namespace('brithoncrm.todomvc.components.todoapp', {

    getComponentClass: function() {
        var TodoApp = React.createClass({

            mixins: [ImmutableRenderMixin],

            render: function() { return ns.render(this); }
        });

        return TodoApp;
    },

    render: function(component) {
        var Footer = require('./footer').getComponentClass();
        var Header = require('./header').getComponentClass();
        var MainSection = require('./mainsection').getComponentClass();

        return (
            <div>
                <Header />
                <MainSection
                    allTodos={component.props.todoStore.allTodos}
                    areAllComplete={component.props.todoStore.areAllComplete}
                />
                <Footer allTodos={component.props.todoStore.allTodos} />
            </div>
        );
    }
});
module.exports = ns;
