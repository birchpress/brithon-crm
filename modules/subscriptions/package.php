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
				wp_enqueue_script( 'brithoncrm_test_index',
					$brithoncrm->plugin_url() . '/modules/subscriptions/assets/js/index.bundle.js',
					array( 'birchpress', 'react-with-addons', 'immutable' ) );
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
} );
