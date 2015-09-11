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

			$params = array(
				'ajax_url' => admin_url( 'admin-ajax.php' ),
				'admincp_url' => admin_url(),
				'locale' => get_locale(),
				'textDomain' => 'brithoncrm',
				'translations' => $brithoncrm->common->view->i18n->get_translations(),
			);

			if ( is_main_site() ) {
				$birchpress->view->register_3rd_scripts();
				$birchpress->view->register_core_scripts();
				wp_register_script( 'brithoncrm_subscriptions_apps_admin_subscriptions',
					$brithoncrm->plugin_url() . '/modules/subscriptions/assets/js/apps/admin/subscriptions/index.bundle.js',
					array( 'birchpress', 'react-with-addons', 'immutable' ) );
				wp_localize_script( 'brithoncrm_subscriptions_apps_admin_subscriptions', 'brithoncrm_subscriptions_apps_admin_subscriptions', $params );

				add_action( 'wp_ajax_brithoncrm_subscriptions_i18n', array( $ns, 'i18n_string' ) );

				wp_enqueue_script( 'brithoncrm_subscriptions_apps_admin_subscriptions' );
				wp_enqueue_script( 'checkout_script', 'https://checkout.stripe.com/checkout.js' );
			}
		};

		$ns->wp_admin_init = function() use ( $ns, $brithoncrm ) {

		};

		$ns->create_admin_menus = function() use ( $ns ) {
			add_menu_page( __( 'Billing and invoices', 'brithoncrm' ),
				__( 'Settings', 'brithoncrm' ), 'read',
				'brithoncrm/subscriptions', array( $ns, 'render_setting_page' ), '', 81 );
		};

		$ns->render_setting_page = function() use ( $ns ) {
?>
			<h3><?php _e( 'Billing and invoices', 'brithoncrm' ) ?></h3>
			<section id="birchpress-settings"></section>
<?php
		};

		$ns->i18n_string = function() use ( $ns ) {
			if ( isset( $_POST['string'] ) ) {
				$string = $_POST['string'];
				$result = array( 'result' => __( $string, 'brithoncrm' ) );
				die( json_encode( $result ) );
			}
		};
	} );
