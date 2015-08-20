<?php

birch_ns( 'brithoncrm.registration', function( $ns ) {

        global $brithoncrm;

        $ns->init = function() use ( $ns ) {
            register_activation_hook( __FILE__, array( $ns, 'plugin_init' ) );
            add_action( 'init', array( $ns, 'wp_init' ) );
            add_action( 'admin_init', array( $ns, 'wp_admin_init' ) );
            add_action( 'wp_head', array( $ns, 'wp_header' ) );
        };

        $ns->plugin_init = function() use ( $ns ) {
            register_post_type( 'subscription' );
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

        $ns->wp_admin_init = function() use ( $ns, $brithoncrm ) {

        };

        $ns->wp_header = function() use ( $ns ) {
            $ns->register_widgets();
        };

        $ns->register_widgets = function() use ( $ns ) {
            wp_register_sidebar_widget( 'birchpress-register-form', 'User Area', array( $ns, 'render_registration_widget' ),
                array(
                    'description' => 'Register a new account',
                ) );
        };

        $ns->render_registration_widget = function( $args ) {
            echo $args['before_widget'];
            echo $args['before_title'] . 'Register' .  $args['after_title'];
            if ( !is_user_logged_in() ) {
                echo '<section><a href="wp-login.php">Log in</a></section>';
                echo '<section id="registerapp"></section>';
            }
            echo $args['after_widget'];
        };

        $ns->register_account = function() use ( $ns ) {

            $username = $_POST['username'];
            $password = $_POST['password'];
            $email = $_POST['email'];
            $first_name = $_POST['first_name'];
            $last_name = $_POST['last_name'];
            $org = $_POST['org'];

            if ( ! $username ) {
                $ns->return_err_msg( 'Empty username!' );
            }
            if ( ! $password ) {
                $ns->return_err_msg( 'Empty password!' );
            }
            if ( ! $email ) {
                $ns->return_err_msg( 'Empty email address!' );
            }
            if ( ! $first_name ) {
                $ns->return_err_msg( 'First name required!' );
            }
            if ( ! $last_name ) {
                $ns->return_err_msg( 'Last name required!' );
            }
            if ( ! $org ) {
                $ns->return_err_msg( 'Organization required!' );
            }

            $userdata = array(
                'user_login' => $username,
                'user_pass' => $password,
                'user_email' => $email,
                'display_name' => "$first_name $last_name",
                'nickname' => "$first_name $last_name",
                'first_name' => $first_name,
                'last_name' => $last_name,
            );

            $user_id = wp_insert_user( $userdata );
            $subdir = $ns->generate_blog_dir( $first_name, $last_name );

            if ( ! is_wp_error( $user_id ) ) {
                add_user_meta( $user_id, 'organization', $org );
                $site_id = wpmu_create_blog( $ns->get_clean_basedomain(),
                    $subdir, "$first_name $last_name", $user_id );

                if ( ! is_wp_error( $site_id ) ) {
                    $creds = array();
                    $creds['user_login'] = $username;
                    $creds['user_password'] = $password;
                    $creds['remember'] = true;
                    $usr = wp_signon( $creds, false );

                    die( json_encode(
                            array(
                                'user_id' => $user_id,
                                'site_id' => $site_id,
                                'site_dir' => $subdir,
                            ) ) );
                } else {
                    $ns->return_err_msg( $site_id->get_error_message( $site_id->get_error_code() ) );
                }
            } else {
                $ns->return_err_msg( $user_id->get_error_message( $user_id->get_error_code() ) );
            }
        };

        $ns->return_err_msg = function( $msg, $error = 'Error' ) use ( $ns ) {
            die( json_encode( array(
                        'error' => $error,
                        'message' => $msg,
                    ) ) );
        };

        $ns->return_result = function( $succeed, $data ) use ( $ns ) {
            return array(
                'succeed' => $succeed,
                'data' => $data,
            );
        };

        $ns->get_clean_basedomain = function() use ( $ns ) {
            $domain = preg_replace( '|https?://|', '', site_url() );
            if ( $slash = strpos( $domain, '/' ) ) {
                $domain = substr( $domain, 0, $slash );
            }
            return $domain;
        };

        $ns->generate_blog_dir = function( $first_name, $last_name ) use ( $ns ) {
            return '/'.$first_name.'_'.$last_name.rand();
        };

} );