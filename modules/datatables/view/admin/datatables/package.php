<?php

birch_ns( 'brithoncrm.datatables.view.admin.datatables', function( $ns ) {

        global $brithoncrm;

        $ns->init = function() use ( $ns ) {
            add_action( 'init', array( $ns, 'wp_init' ) );
            add_action( 'admin_init', array( $ns, 'wp_admin_init' ) );
            add_action( 'admin_menu', array( $ns, 'create_admin_menus' ) );
        };

        $ns->wp_init = function() use ( $ns, $brithoncrm ) {
            global $birchpress;

            if ( is_main_site() ) {
                $birchpress->view->register_3rd_scripts();
                $birchpress->view->register_core_scripts();
                wp_register_script( 'brithoncrm_datatables_apps_admin_datatables',
                    $brithoncrm->plugin_url() . '/modules/datatables/assets/js/apps/admin/datatables/index.bundle.js',
                    array( 'birchpress', 'react-with-addons', 'immutable' ) );

                wp_enqueue_script( 'brithoncrm_datatables_apps_admin_datatables' );
            }
        };

        $ns->wp_admin_init = function() use ( $ns, $brithoncrm ) {

        };

        $ns->create_admin_menus = function() use ( $ns ) {
            add_menu_page( 'Datatable Demo', 'DataTable', 'read',
                'brithoncrm/datatables', array( $ns, 'render_setting_page' ), '', 82 );
        };
        $ns->render_setting_page = function() use ( $ns ) {
?>
            <section id="datatabledemo"></section>
<?php
        };

} );
