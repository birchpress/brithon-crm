<?php

birch_ns( 'brithoncrm.subscriptions', function( $ns ) {

		global $brithoncrm;

		$ns->init = function() use ( $ns ) {
			add_action( 'init', array( $ns, 'wp_init' ) );
			add_action( 'admin_init', array( $ns, 'wp_admin_init' ) );
			add_action( 'wp_head', array( $ns, 'wp_header' ) );
		};

		$ns->wp_init = function() use ( $ns, $brithoncrm ) {
			global $birchpress;

			if(is_main_site()){
				$birchpress->view->register_3rd_scripts();
				$birchpress->view->register_core_scripts();
				wp_enqueue_style( 'brithoncrm_subscriptions_base',
					$brithoncrm->plugin_url() . '/modules/subscriptions/assets/css/base.css' );
				wp_enqueue_style( 'brithoncrm_subscriptions_app',
					$brithoncrm->plugin_url() . '/modules/subscriptions/assets/css/app.css' );
				wp_register_script( 'brithoncrm_subscriptions_index',
					$brithoncrm->plugin_url() . '/modules/subscriptions/assets/js/index.bundle.js',
					array( 'birchpress', 'react-with-addons', 'immutable' ) );
				//wp_localize_script( 'brithoncrm_subscriptions_registration_var', 'reg_date', $reg_data );
				add_action( 'admin_post_register_birchpress_account', array( $ns, 'register_account' ));
				wp_enqueue_script( 'brithoncrm_subscriptions_index');
			}
			
			wp_register_sidebar_widget( 'birchpress-register-form', 'Register', array( $ns, 'render_registration_widget' ),
				array(
					'description' => 'Register a new account'
				));
		};

		$ns->wp_admin_init = function() use ( $ns, $brithoncrm ) {

		};

		$ns->wp_header = function() use ( $ns, $brithoncrm ) {

		};

		$ns->render_registration_widget = function($args) {
    		echo $args['before_widget'];
    		echo $args['before_title'] . 'Register' .  $args['after_title'];
    		echo '<section id="registerapp"></section>';
    		echo $args['after_widget'];
   		};

   		$ns->register_account = function() use ( $ns ) {

            $username = $_POST['username'];
            $password = $_POST['password'];
            $email = $_POST['email'];
            $first_name = $_POST['first_name'];
            $last_name = $_POST['last_name'];
            $org = $_POST['org'];

            if( !$username ) {
                $ns->return_err_msg('Empty username!');
            } 
            if ( !$password ) {
                $ns->return_err_msg('Empty password!');
            } 
            if ( !$email ) {
                $ns->return_err_msg('Empty email address!');
            }
            if ( !$first_name ) {
                $ns->return_err_msg('First name required!');
            }
            if ( !$last_name ) {
                $ns->return_err_msg('Last name required!');
            }
            if ( !$org ) {
                $ns->return_err_msg('Organization required!');
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
            
            if( !is_wp_error( $user_id ) ) {
                add_user_meta( $user_id, 'organization', $org );
                $site_id = wpmu_create_blog( $ns->get_clean_basedomain(), 
                    $subdir, "$first_name $last_name", $user_id );
                
                if( !is_wp_error( $site_id ) ) {
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
                    )));
                } else {
                    $ns->return_err_msg( $site_id->get_error_message( $site_id->get_error_code() ) );
                }
            } else {
                $ns->return_err_msg( $user_id->get_error_message( $user_id->get_error_code() ) );
            }
   		};

   		$ns->return_err_msg = function($msg) use ( $ns ) {
            die("{'message':'$msg'}");
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
