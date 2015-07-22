var React = require('react');
var ImmutableRenderMixin = require('react-immutable-render-mixin')

var ReactMixinCompositor = birchpress.react.MixinCompositor;

var clazz = birchpress.provide('brithoncrm.todomvc.components.TodoApp', {

    __mixins__: [ReactMixinCompositor],

    getReactMixins: function(component) {
        return [ImmutableRenderMixin];
    },

    render: function(component) {
        var Footer = require('./footer');
        var Header = require('./header');
        var MainSection = require('./mainsection');

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
module.exports = clazz;
