<?php

birch_ns( 'brithoncrm.subscriptions.view.admin.subscriptions', function( $ns ) {

		global $brithoncrm;

		$ns->init = function() use ( $ns ) {
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

				wp_enqueue_script( 'brithoncrm_subscriptions_index' );

				wp_enqueue_script( 'checkout_script', 'https://checkout.stripe.com/checkout.js' );
			}
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
