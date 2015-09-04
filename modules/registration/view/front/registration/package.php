<?php

birch_ns( 'brithoncrm.registration.view.front.registration', function( $ns ) {

		global $brithoncrm;

		$ns->init = function() use ( $ns ) {
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
			$po_str = $brithoncrm->common->view->i18n->get_po_file();
			$locale = get_locale();
			$birchpress_i18n = array(
				'textDomain' => 'brithoncrm',
				'locale' => $locale
			);
			$po_string = array('poString' => $po_str);

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
				wp_localize_script( 'brithoncrm_registration_apps_front_registration', 'birchpress_i18n', $birchpress_i18n);
				wp_localize_script( 'brithoncrm_registration_apps_front_registration', 'i18n_registration', $po_string);

				wp_enqueue_script( 'brithoncrm_registration_apps_front_registration' );

				add_action( 'wp_ajax_nopriv_brithoncrm_registration_i18n', array( $ns, 'i18n_string' ) );
			}
		};

		$ns->wp_admin_init = function() use ( $ns, $brithoncrm ) {

		};

		$ns->wp_header = function() use ( $ns ) {

		};

		$ns->render_registration_entry = function() use ( $ns ) {
			$content = '<section><a href="wp-login.php">' . __( 'Log in', 'brithoncrm' ) . '</a></section>';
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
				$result = array( 'result' => __( $string, 'brithoncrm' ) );
				die( json_encode( $result ) );
			}
		};

	} );
