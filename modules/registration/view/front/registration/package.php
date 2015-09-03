<?php

birch_ns( 'brithoncrm.registration.view.front.registration', function( $ns ) {

		global $brithoncrm;

		$ns->init = function() use ( $ns ) {
			add_action( 'init', array( $ns, 'wp_init' ) );
			add_action( 'admin_init', array( $ns, 'wp_admin_init' ) );
			add_action( 'wp_head', array( $ns, 'wp_header' ) );
			add_action( 'plugins_loaded', array( $ns, 'load_i18n' ) );
		};

		$ns->wp_init = function() use ( $ns, $brithoncrm ) {
			global $birchpress;

			$bp_urls = array(
				'ajax_url' => admin_url( 'admin-ajax.php' ),
				'admincp_url' => admin_url(),
			);
			$bp_uid = array( 'uid' => get_current_user_id() );

			if ( is_main_site() ) {
				add_shortcode( 'birchpress_registration', array( $ns, 'render_registration_entry' ) );

				$birchpress->view->register_3rd_scripts();
				$birchpress->view->register_core_scripts();
				wp_enqueue_style( 'brithoncrm_registration_base',
					$brithoncrm->plugin_url() . '/modules/registration/assets/css/base.css' );
				wp_enqueue_style( 'brithoncrm_registration_app',
					$brithoncrm->plugin_url() . '/modules/registration/assets/css/app.css' );
				wp_register_script( 'brithoncrm_registration_apps_front_registration',
					$brithoncrm->plugin_url() . '/modules/registration/assets/js/apps/front/registration/index.bundle.js',
					array( 'birchpress', 'react-with-addons', 'immutable' ) );
				wp_localize_script( 'brithoncrm_registration_apps_front_registration', 'bp_urls', $bp_urls );

				wp_enqueue_script( 'brithoncrm_registration_apps_front_registration' );

				add_action( 'wp_ajax_nopriv_brithoncrm_registration_i18n', array( $ns, 'i18n_string' ) );
			}
		};

		$ns->wp_admin_init = function() use ( $ns, $brithoncrm ) {

		};

		$ns->wp_header = function() use ( $ns ) {

		};

		$ns->load_i18n = function() use ( $ns ) {
			load_plugin_textdomain( 'brithoncrm-registration', false, 'brithon-crm/modules/registration/languages' );
		};

		$ns->render_registration_entry = function() use ( $ns ) {
			$content = '<section><a href="wp-login.php">' . __('Log in', 'brithoncrm-registration') . '</a></section>';
			$content = $content.'<section id="registerapp"></section>';
			if ( !is_user_logged_in() ) {
				return $content;
			} else {
				return '';
			}
		};

		$ns->i18n_string = function() use ( $ns ) {
			if ( isset( $_POST['string'] ) ) {
				$string = $_POST['string'];
				$result = array( 'result' => __( $string, 'brithoncrm-registration' ) );
				die( json_encode( $result ) );
			}
		};

	} );
