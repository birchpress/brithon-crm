<?php

birch_ns( 'brithoncrm.subscriptions', function( $ns ) {

        global $brithoncrm;

        $ns->plugin_init = function() use ( $ns ) {
            register_post_type( 'subscription' );
        };

        $ns->wp_admin_init = function() use ( $ns, $brithoncrm ) {

        };

        $ns->create_admin_menus = function() use ( $ns ) {
            add_menu_page( 'Billing and invoices', 'Settings', 'read',
                'brithoncrm/subscriptions', array( $ns, 'render_setting_page' ), '', 81 );
        };
        $ns->render_setting_page = function() use ( $ns ) {
?>
            <h3>Billing and invoices</h3>
            <section id="birchpress-settings"></section>
<?php
        };

} );