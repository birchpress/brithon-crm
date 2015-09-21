<?php

birch_ns( 'brithoncrm.sso.model', function( $ns ) {

		global $brithoncrm;

		$ns->init = function() use ( $ns ) {
			add_action( 'init', array( $ns, 'wp_init' ) );
		};

		$ns->wp_init = function() use ( $ns, $brithoncrm ) {
			global $birchpress;

			if ( is_main_site() ) {
				add_action( 'wp_ajax_nopriv_brithoncrm_login', array( $ns, 'user_login' ) );
				add_action( 'wp_ajax_nopriv_brithoncrm_register', array( $ns, 'user_register' ) );
				add_action( 'wp_ajax_brithoncrm_get_user_info', array( $ns, 'get_user_info' ) );
			}
		};

		$ns->user_login = function() use ( $ns ) {
			$username = $_POST['username'];
			$password = $_POST['password'];
			$remember = $_POST['remebmer'];

			$creds = array(
				'user_login' => $username,
				'user_password' => $password,
				'remebmer' => $remember,
			);
			$user = wp_signon( $creds, false );
			if ( is_wp_error( $user ) ) {
				$ns->return_error_msg( $user->get_error_message() );
			}
			die(json_encode(
				'id' => $user->ID,
				'first_name' => $user->first_name,
				'last_name' => $user->last_name,
				'organization' => get_user_meta( $user->ID, 'organization', true ),
			));
		};

		$ns->user_register = function() use ( $ns, $brithoncrm ) {
			return $brithoncrm->registration->register_account();
		};

		$ns->get_user_info = function() use ( $ns, $brithoncrm ) {
			return $brithoncrm->subscriptions->model->retrieve_customer_info();
		}
	} );
