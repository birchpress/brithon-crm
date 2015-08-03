<?php

birch_ns( 'brithoncrm.subscriptions', function( $ns ) {

        global $brithoncrm;

        $ns->init = function() use ( $ns ) {
            add_action( 'init', array( $ns, 'wp_init' ) );
            add_action( 'admin_init', array( $ns, 'wp_admin_init' ) );
            add_action( 'admin_menu', array( $ns, 'create_admin_menus' ) );
            add_action( 'wp_head', array( $ns, 'wp_header' ) );
        };

        $ns->wp_init = function() use ( $ns, $brithoncrm ) {
            global $birchpress;

            $bp_urls = array(
                'ajax_url' => admin_url( 'admin-ajax.php' ),
                'admincp_url' => admin_url()
            );

            if ( is_main_site() ) {
                $birchpress->view->register_3rd_scripts();
                $birchpress->view->register_core_scripts();
                wp_enqueue_style( 'brithoncrm_subscriptions_base',
                    $brithoncrm->plugin_url() . '/modules/subscriptions/assets/css/base.css' );
                wp_enqueue_style( 'brithoncrm_subscriptions_app',
                    $brithoncrm->plugin_url() . '/modules/subscriptions/assets/css/app.css' );
                wp_register_script( 'brithoncrm_subscriptions_index',
                    $brithoncrm->plugin_url() . '/modules/subscriptions/assets/js/index.bundle.js',
                    array( 'birchpress', 'react-with-addons', 'immutable' ) );
                wp_localize_script( 'brithoncrm_subscriptions_index', 'bp_urls', $bp_urls );
                add_action( 'wp_ajax_nopriv_register_birchpress_account', array( $ns, 'register_account' ) );
                wp_enqueue_script( 'brithoncrm_subscriptions_index' );
            }

            wp_register_sidebar_widget( 'birchpress-register-form', 'User Area', array( $ns, 'render_registration_widget' ),
                array(
                    'description' => 'Register a new account'
                ) );
        };

        $ns->wp_admin_init = function() use ( $ns, $brithoncrm ) {
            $ns->create_payment_dbtable();
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

        $ns->wp_header = function() use ( $ns, $brithoncrm ) {

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

            if ( !$username ) {
                $ns->return_err_msg( 'Empty username!' );
            }
            if ( !$password ) {
                $ns->return_err_msg( 'Empty password!' );
            }
            if ( !$email ) {
                $ns->return_err_msg( 'Empty email address!' );
            }
            if ( !$first_name ) {
                $ns->return_err_msg( 'First name required!' );
            }
            if ( !$last_name ) {
                $ns->return_err_msg( 'Last name required!' );
            }
            if ( !$org ) {
                $ns->return_err_msg( 'Organization required!' );
            }

            $userdata = array(
                'user_login'  =>  $username,
                'user_pass'   =>  $password,
                'user_email'  =>  $email,
                'display_name'=>  "$first_name $last_name",
                'nickname'    =>  "$first_name $last_name",
                'first_name'  =>  $first_name,
                'last_name'   =>  $last_name
            );

            $user_id = wp_insert_user( $userdata );
            $subdir = $ns->generate_blog_dir( $first_name, $last_name );

            if ( !is_wp_error( $user_id ) ) {
                add_user_meta( $user_id, 'organization', $org );
                $site_id = wpmu_create_blog( $ns->get_clean_basedomain(),
                    $subdir, "$first_name $last_name", $user_id );

                if ( !is_wp_error( $site_id ) ) {
                    $creds = array();
                    $creds['user_login'] = $username;
                    $creds['user_password'] = $password;
                    $creds['remember'] = true;
                    $usr = wp_signon( $creds, false );

                    die( json_encode(
                            array(
                                'user_id' => $user_id,
                                'site_id' => $site_id,
                                'site_dir' => $subdir
                            ) ) );
                } else {
                    $ns->return_err_msg( $site_id->get_error_message( $site_id->get_error_code() ) );
                }
            } else {
                $ns->return_err_msg( $user_id->get_error_message( $user_id->get_error_code() ) );
            }
        };

        $ns->return_err_msg = function( $msg ) use ( $ns ) {
            die( "{'message':'$msg'}" );
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

        $ns->create_payment_dbtable = function() use ( $ns ) {
            global $wpdb;

            $subscription_meta = $wpdb->prefix . 'subscriptionmeta';
            $bill_meta = $wpdb->prefix . 'billmeta';

            $sql = "CREATE TABLE `$subscription_meta` (
                        `id` int(11) PRIMARY KEY AUTO_INCREMENT,
                        `user_id` int(11) NOT NULL,
                        `plan_id` int(11) NOT NULL,
                        `plan_charge` int(11) NOT NULL,
                        `plan_max_providers` int(11) NOT NULL,
                        `start_date` datetime NOT NULL,
                        `expire_date` datetime NOT NULL,
                        `remain_credit` int(11) NOT NULL,
                        `card_token` text
                    );
                    CREATE TABLE `$bill_meta` (
                        `id` int(11) PRIMARY KEY AUTO_INCREMENT,
                        `user_id` int(11) NOT NULL,
                        `charge_value` int(11) NOT NULL,
                        `charge_date` datetime NOT NULL,
                        `plan_id` int(11) NOT NULL
                    );";
            if ( $wpdb->get_var( "SHOW TABLES LIKE '$subscription_meta';" ) != $subscription_meta ) {
                if ( $wpdb->get_var( "SHOW TABLES LIKE '$bill_meta';" ) != $bill_meta ) {
                    require_once ABSPATH . 'wp-admin/includes/upgrade.php';

                    dbDelta( $sql );
                }
            }
        };

        $ns->create_subscription = function( $uid, $plan_id, $plan_charge, $plan_providers, $pays, $months, $card_token ) use ( $ns ) {
            global $wpdb;

            $record = array(
                'user_id' => $uid,
                'plan_id' => $plan_id,
                'plan_charge' => $plan_charge,
                'plan_max_providers' => $plan_providers,
                'start_date' => date( 'Y-m-d' ),
                'expire_date' => date( 'Y-m-d', time() + 86400 * 30 * $months ),
                'remain_credit' => $pays - $plan_charge,
                'card_token' => $card_token
            );

            return $wpdb->insert( $wpdb->prefix.'subscriptionmeta', $record );
        };

        $ns->create_bill_record = function( $uid, $charge_value, $plan_id ) use ( $ns ) {
            global $wpdb;

            $record = array(
                'user_id' => $uid,
                'charge_value' => $charge_value,
                'charge_date' => date( 'Y-m-d' ),
                'plan_id' => $plan_id
            );

            return $wpdb->insert( $wpdb->prefix.'billmeta', $record );
        };

        $ns->update_subscription_plan = function( $uid, $plan_id, $plan_charge, $plan_providers ) use ( $ns ) {
            global $wpdb;

            $record = array(
                'plan_id' => $plan_id,
                'plan_charge' => $plan_charge,
                'plan_max_providers' => $plan_providers
            );

            return $wpdb->update( $wpdb->prefix.'subscriptionmeta', $record, array( 'user_id' => $uid ) );
        };

        $ns->update_credit_card = function( $uid, $token ) use ( $ns ) {
            global $wpdb;

            return $wpdb->update(
                $wpdb->prefix.'subscriptionmeta',
                array( 'card_token' => $token ),
                array( 'user_id' => $uid )
            );
        };

        $ns->query_subscription = function( $uid ) use ( $ns ) {
            global $wpdb;
            $table_name = $wpdb->prefix.'subscriptionmeta';
            return $wpdb->get_results( "SELECT * from $table_name WHERE user_id=$uid" );
        };

        $ns->query_bill_records = function( $uid ) use ( $ns ) {
            global $wpdb;
            $table_name = $wpdb->prefix.'billmeta';
            return $wpdb->get_results( "SELECT * FROM $table_name WHERE user_id=$uid" );
        };

        $ns->get_stripe_publishable_key = function() use ( $ns ) {
            return 'pk_test_6pRNASCoBOKtIshFeQd4XMUh';
        };

        $ns->get_stripe_private_key = function() use ($ns ){
            return 'sk_test_zk5XKLEhfi6nyfmCcxxFM2bQ';
        };
    } );
