<?php

birch_ns( 'brithoncrm.registration', function( $ns ) {

        global $brithoncrm;

        $ns->init = function() use ( $ns ) {
            add_action( 'init', array( $ns, 'wp_init' ) );
            add_action( 'admin_init', array( $ns, 'wp_admin_init' ) );
            add_action( 'wp_head', array( $ns, 'wp_header' ) );
            add_action( 'init', array( $ns, 'wp_init' ) );
        };

        $ns->wp_init = function() use ( $ns, $brithoncrm ) {
            global $birchpress;

            $bp_urls = array(
                'ajax_url' => admin_url( 'admin-ajax.php' ),
                'admincp_url' => admin_url(),
            );
            $bp_uid = array( 'uid' => get_current_user_id() );

            if ( is_main_site() ) {
                $birchpress->view->register_3rd_scripts();
                $birchpress->view->register_core_scripts();
                wp_enqueue_style( 'brithoncrm_registration_base',
                    $brithoncrm->plugin_url() . '/modules/registration/assets/css/base.css' );
                wp_enqueue_style( 'brithoncrm_registration_app',
                    $brithoncrm->plugin_url() . '/modules/registration/assets/css/app.css' );
                wp_register_script( 'brithoncrm_registration_index',
                    $brithoncrm->plugin_url() . '/modules/registration/assets/js/index.bundle.js',
                    array( 'birchpress', 'react-with-addons', 'immutable' ) );
                wp_localize_script( 'brithoncrm_registration_index', 'bp_urls', $bp_urls );
                wp_localize_script( 'brithoncrm_registration_index', 'bp_uid', $bp_uid );
                add_action( 'wp_ajax_nopriv_register_birchpress_account', array( $ns, 'register_account' ) );

                wp_enqueue_script( 'brithoncrm_registration_index' );
            }
        };

    } );
