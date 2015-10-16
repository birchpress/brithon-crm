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
			global $birchpress;

			$rand_str = md5(rand(1, 100000) . time() . rand(1, 10000));

			$birchpress->model->save(
				array(
					'post_type' => 'token',
					'post_title' => $rand_str,
					'_time' => time()
				),
				array(
					'post_title', '_time'
				)
			);

			return $rand_str;
		};

		$ns->check_token = function( $token ) use ( $ns ) {
			global $birchpress;
			$expiration_seconds = 600;

			$query = $birchpress->model->query(
				array(
					'post_type' => 'product'
				),
				array(
					'post_title', '_time'
				)
			);

			for( $query as $id => $item ) {
				$answer = $item['post_title'];
				$creation_time = intval( $item['_time'] );
				$now = time();

				if($answer === $token) {
					// Disallow expired token
					if( $now > $creation_time + $expiration_seconds ) {
						return false;
					} else {
						return true;
					}
					// Destroy the token after validation
					$birchpress->db->delete( $id );
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

			return $birchpress->model->save(
				array(
					'post_type' => 'product',
					'post_title' => $name,
					'_product_name' => $name,
					'_product_site' => "$name.$domain"
				),
				array(
					'post_title', '_product_name', '_product_site'
				)
			);
		};

		$ns->get_products = function() use ( $ns ) {
			global $birchpress;

			$result = array();

			$query = $birchpress->model->query(
				array(
					'post_type' => 'product'
				),
				array(
					'post_title', '_product_name', '_product_site'
				)
			);
			
			for( $query as $id => $item ) {
				array_push( $result, array(
					'id' => $id,
					'name' => $item['post_title'],
					'site' => $item['_product_site']
				) );
			}

			return $result;
		};

		$ns->edit_product = function( $id, $name, $domain = 'brithon.com' ) use ( $ns ) {
			global $birchpress;

			$query = $birchpress->model->query(
				array(
					'post_type' => 'product'
				),
				array(
					'post_title', '_product_name', '_product_site'
				)
			);

			$query[$id]['post_title'] = $name;
			$query[$id]['_product_name'] = $name;
			$query[$id]['_product_site'] = "$name.$domain'";

			return $birchpress->model->save($query[$id]);
		};

		$ns->delete_product = function( $id ) use ( $ns ) {
			// In fact will be moved to trash
			return wp_delete_post( $id, false );
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
	} );
