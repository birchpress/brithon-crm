<?php

birch_ns( 'brithoncrm.registration.view.index.registration', function( $ns ) {

		global $brithoncrm;

		$ns->init = function() use ( $ns ) {
			register_activation_hook(__FILE__, array($ns, 'register_widgets'));
			add_action( 'init', array( $ns, 'wp_init' ) );
			add_action( 'admin_init', array( $ns, 'wp_admin_init' ) );
			add_action( 'wp_head', array( $ns, 'wp_header' ) );
		};

		$ns->wp_init = function() use ( $ns, $brithoncrm ) {
			global $birchpress;

			$bp_urls = array(
				'ajax_url' => admin_url( 'admin-ajax.php' ),
				'admincp_url' => admin_url(),
			);
			$bp_uid = array( 'uid' => get_current_user_id() );

			if ( is_main_site() ) {
				$ns->register_widgets();
				
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

				wp_enqueue_script( 'brithoncrm_registration_index' );
			}
		};

		$ns->wp_admin_init = function() use ( $ns, $brithoncrm ) {

		};

		$ns->wp_header = function() use ( $ns ) {
			//$ns->register_widgets();
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

} );
