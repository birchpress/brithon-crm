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
			register_post_type( 'token' );
		};

		$ns->wp_init = function() use ( $ns, $brithoncrm ) {
			global $birchpress;

			if ( is_main_site() ) {
				add_action( 'wp_ajax_nopriv_brithoncrm_login', array( $ns, 'user_login' ) );
				add_action( 'wp_ajax_nopriv_brithoncrm_register', array( $ns, 'user_register' ) );
				add_action( 'wp_ajax_brithoncrm_get_user_info', array( $ns, 'get_user_info' ) );
			}
		};

		$ns->create_token = function() use ( $ns ) {
			$rand_str = md5(rand(1, 100000) . time() . rand(1, 10000));

			$res = wp_insert_post(array(
				'post_type' => 'token',
				'post_content' => $rand_str,
				'post_title' => $rand_str
			), true);

			if( is_wp_error($res)) {
				$ns->return_error_msg($res->get_error_message($res->get_error_code()));
			}

			add_post_meta( $res, 'time', time(), true );

			return $rand_str;
		};

		$ns->check_token = function( $token ) use ( $ns ) {
			global $birchpress;
			$expiration_seconds = 600;

			$query = new WP_Query(array(
				'post_type' => 'product'
			));

			while( $query->have_posts() ) {
				$query->the_post();

				$answer = the_title('', '', false);
				$creation_time = intval( get_post_meta( the_id(), 'time', true ) );
				$now = time();

				if($answer === $token) {
					// Disallow expired token
					if( $now > $creation_time + $expiration_seconds ) {
						return false;
					} else {
						return true;
					}
					// Destroy the token after validation
					wp_delete_post( the_id(), true );
				}
			}

			return false;
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

			return wp_insert_post(array(
					'post_type' => 'product',
					'post_title' => $name,
					'post_content' => "$name.$domain"
			), true);
		};

		$ns->get_products = function() use ( $ns ) {
			global $birchpress;

			$result = array();

			$query = new WP_Query(array(
				'post_type' => 'product'
			));
			
			while($query->have_posts()) {
				$query->the_post();
				array_push( $result, array(
					'id' => the_id(),
					'name' => the_title('', '', false),
					'site' => the_content()
				) );
			}

			return $result;
		};

		$ns->edit_product = function( $id, $name, $domain = 'brithon.com' ) use ( $ns ) {
			global $birchpress;

			return wp_insert_post(array(
				'ID' => $id,
				'post_type' => 'product',
				'post_title' => $name,
				'post_content' => "$name.$domain"
			), true);
		};

		$ns->delete_product = function( $id ) use ( $ns ) {
			return wp_delete_post( $id, true );
		}

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
		};

		$ns->return_error_msg = function( $msg ) use ( $ns ) {
			die(json_encode(array(
				'message' => $msg
			)));
		}
	} );
