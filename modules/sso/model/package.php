<?php

birch_ns( 'brithoncrm.sso.model', function( $ns ) {

		global $brithoncrm;

		$ns->init = function() use ( $ns ) {
			register_activation_hook( __FILE__, array( $ns, 'plugin_init' ) );
			add_action( 'init', array( $ns, 'wp_init' ) );
		};

		$ns->plugin_init = function() use ( $ns ) {
			global $birchpress;

			$datatype = 'product';
			register_post_type( $datatype );
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
			die(json_encode(array(
				'id' => $user->ID,
				'first_name' => $user->first_name,
				'last_name' => $user->last_name,
				'organization' => get_user_meta( $user->ID, 'organization', true ),
			)));
		};

		$ns->user_register = function() use ( $ns, $brithoncrm ) {
			return $brithoncrm->registration->register_account();
		};

		$ns->get_user_info = function() use ( $ns, $brithoncrm ) {
			return $brithoncrm->subscriptions->model->retrieve_customer_info();
		};

		$ns->add_product = function( $name, $domain = 'brithon.com' ) use ( $ns, $brithoncrm ) {
			global $birchpress;

			$birchpress->model->save(
				array(
					'post_type' => 'product',
					'post_title' => $name,
					'_product_name' => $name,
					'_product_site' => "$name.$domain"
				)
			);
		};

		$ns->get_products = function() use ( $ns ) {
			global $birchpress;

			$result = array();

			$query = $birchpress->model->query(
				array(
					'post_type' => 'product'
				)
			);
			while ( $query->have_posts() ) {
				$meta = get_post_meta( the_id() );
				array_push( $result, $meta );
			}

			return $result;
		};

		$ns->request = function($url, $method, $data) use ( $ns ) {
			$context = array(
				'http' => array(
					'method' => $method,
					'header' => '',
					'content' => $data
				)
			);
			$context = stream_context_create($context);
			return file_get_contents($url, false, $context);
		}
	} );
