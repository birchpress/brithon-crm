<?php

require __DIR__.'/vendor/autoload.php';

birch_ns( 'brithoncrm.subscriptions', function( $ns ) {

		global $brithoncrm;

		$ns->init = function() use ( $ns ) {
			register_activation_hook( __FILE__, array( $ns, 'plugin_init' ) );
			add_action( 'init', array( $ns, 'wp_init' ) );
			add_action( 'admin_init', array( $ns, 'wp_admin_init' ) );
			add_action( 'admin_menu', array( $ns, 'create_admin_menus' ) );
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
				wp_enqueue_style( 'brithoncrm_subscriptions_base',
					$brithoncrm->plugin_url() . '/modules/subscriptions/assets/css/base.css' );
				wp_enqueue_style( 'brithoncrm_subscriptions_app',
					$brithoncrm->plugin_url() . '/modules/subscriptions/assets/css/app.css' );
				wp_register_script( 'brithoncrm_subscriptions_index',
					$brithoncrm->plugin_url() . '/modules/subscriptions/assets/js/index.bundle.js',
					array( 'birchpress', 'react-with-addons', 'immutable' ) );
				wp_localize_script( 'brithoncrm_subscriptions_index', 'bp_urls', $bp_urls );
				wp_localize_script( 'brithoncrm_subscriptions_index', 'bp_uid', $bp_uid );
				add_action( 'wp_ajax_birchpress_subscriptions_getplans', array( $ns, 'retrieve_all_plans' ) );
				add_action( 'wp_ajax_birchpress_subscriptions_getcustomer', array( $ns, 'retrieve_customer_info' ) );
				add_action( 'wp_ajax_birchpress_subscriptions_regcustomer', array( $ns, 'register_customer' ) );
				add_action( 'wp_ajax_birchpress_subscriptions_updateplan', array( $ns, 'update_user_plan' ) );
				add_action( 'wp_ajax_birchpress_subscriptions_updatecard', array( $ns, 'update_user_card' ) );

				wp_enqueue_script( 'brithoncrm_subscriptions_index' );

				wp_enqueue_script( 'checkout_script', 'https://checkout.stripe.com/checkout.js' );
			}
		};

	} );
