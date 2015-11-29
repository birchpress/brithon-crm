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

			$status = $ns->verfiy_login_state();
			if ( !$status ) {
				wp_logout();
			}

			if ( is_main_site() ) {
				add_action( 'wp_ajax_nopriv_brithoncrm_login', array( $ns, 'user_login' ) );
				add_action( 'wp_ajax_nopriv_brithoncrm_register', array( $ns, 'user_register' ) );
				add_action( 'wp_ajax_nopriv_brithoncrm_errorhandler', array( $ns, 'remote_error_handler' ) );
				add_action( 'wp_ajax_brithoncrm_logout', array( $ns, 'global_logout' ) );
				add_action( 'wp_ajax_brithoncrm_errorhandler', array( $ns, 'remote_error_handler' ) );
				add_action( 'wp_ajax_brithoncrm_test_set_product', array( $ns, 'test_set_product' ) );
				add_action( 'wp_ajax_brithoncrm_test_get_user_info', array( $ns, 'get_user_info' ) );
				add_action( 'wp_ajax_brithoncrm_test_get_user_order', array( $ns, 'get_user_order' ) );
				add_action( 'wp_ajax_brithoncrm_test_get_user_subscriptions', array( $ns, 'get_user_subscriptions' ) );
				add_action( 'authenticate', array( $ns, 'user_login' ), 10, 3 );
				add_action( 'logout_url', array( $ns, 'brithoncrm_logout' ), 11, 2 );
			}
		};

		$ns->get_hkey = function() use ( $ns ) {
			$hkey = '__bR17h0n-#sEcR37_-t0KEn';
			return $hkey;
		};

		$ns->get_common_key = function() use ( $ns ) {
			$common_key = '#@Br1TH0n-C00ki3_KEY#@DSAF';
			return $common_key;
		};

		$ns->get_iv = function( $size ) use ( $ns ) {
			$str = '#$Scfg#562SdgdsrTd35DsxRvcs#@fds';
			return substr( $str, 0, $size );
		};

		$ns->create_token = function( $product_name, $timestamp ) use ( $ns ) {
			$hkey = $ns->get_hkey();
			$str = $product_name . '-' . $timestamp;
			$rand_str = hash_hmac( 'sha256', $str, $hkey );

			return $rand_str;
		};

		$ns->check_token = function( $token, $product_name, $timestamp ) use ( $ns ) {
			$expiration_seconds = 60;
			$hkey = $ns->get_hkey();

			$timestamp = intval( $timestamp );

			if ( $timestamp + $expiration_seconds < time() ) {
				return false;
			}

			if ( $token === hash_hmac( 'sha256', "$product_name-$timestamp", $hkey ) ) {
				return true;
			}

			return false;
		};

		$ns->encrypt = function( $string, $key ) use ( $ns ) {
			$td = mcrypt_module_open( 'rijndael-256', '', 'cfb', '' );
			$iv = $ns->get_iv( mcrypt_enc_get_iv_size( $td ) );
			$key_size = mcrypt_enc_get_key_size( $td );
			$key = substr( md5( $key ), 0, $key_size );

			mcrypt_generic_init( $td, $key, $iv );

			$encrypted = mcrypt_generic( $td, $string );
			$result = base64_encode( $encrypted );

			mcrypt_generic_deinit( $td );
			mcrypt_module_close( $td );
			return $result;
		};

		$ns->decrypt = function( $string, $key ) use ( $ns ) {
			$td = mcrypt_module_open( 'rijndael-256', '', 'cfb', '' );
			$iv = $ns->get_iv( mcrypt_enc_get_iv_size( $td ) );
			$key_size = mcrypt_enc_get_key_size( $td );
			$key = substr( md5( $key ), 0, $key_size );

			mcrypt_generic_init( $td, $key, $iv );

			$cipher = base64_decode( $string );
			$result = mdecrypt_generic( $td, $cipher );

			mcrypt_generic_deinit( $td );
			mcrypt_module_close( $td );

			return $result;
		};

		$ns->sign_cookie = function( $title, $data, $remebmer ) use ( $ns ) {
			if ( gettype( $data ) == 'array' ) {
				$data = json_encode( $data );
			}

			$expire = 0;
			if ( $remebmer ) {
				$expire = time() + 86400 * 30;
			}

			return setcookie( $title, $data, $expire, '/', '.brithon.com', false, true );
		};

		$ns->verfiy_login_state = function() use ( $ns ) {
			if ( !isset( $_COOKIE['BRITHON_USER'] ) ) {
				return false;
			}

			$user_cookie = $_COOKIE['BRITHON_USER'];
			$result = $ns->decrypt( $user_cookie, $ns->get_common_key() );
			$data = json_decode( $result );

			if ( gettype( $data ) !== 'object' ) {
				return false;
			}

			$credential = $data->creds;
			$key = $data->key;
			$credential = $ns->decrypt( $credential, $key );
			$credential = json_decode( $credential, true );

			$current_user = wp_get_current_user();
			if ( ! $current_user ) {
				return wp_signon( $credential );
			} else if ( $current_user->user_login !== $credential['user_login'] ) {
				wp_logout();
				return wp_signon( $credential );
			} else {
				return $current_user;
			}
		};

		$ns->global_signon = function( $creds ) use ( $ns ) {
			$remember = $creds['remember'];
			$key = $ns->create_token( 'brithon.com', time() );
			$cred_str = $ns->encrypt( json_encode( $creds ), $key );

			$common_key = $ns->get_common_key();
			$data = array(
				'creds' => $cred_str,
				'key' => $key
			);
			$cookie = $ns->encrypt( json_encode( $data ), $common_key );

			return $ns->sign_cookie( 'BRITHON_USER', $cookie , $remember );
		};

		$ns->global_logout = function() use ( $ns ) {
			setcookie( 'BRITHON_USER', '', -1, '/', '.brithon.com', false, true );
			if ( wp_get_current_user() ) {
				wp_logout();
			}

			die( '<script>location.assign("/");</script>' );
		};

		$ns->brithoncrm_logout = function( $url, $redirect ) use ( $ns ) {
			return admin_url( 'admin-ajax.php' ) . '?action=brithoncrm_logout';
		};

		$ns->user_login = function( $user, $username, $password ) use ( $ns ) {
			if ( is_wp_error( $user ) ) {
				return $user;
			}

			$cred = array(
				'user_login' => $username,
				'user_password' => $password,
				'remember' => true
			);

			$ns->global_signon( $cred );
			return $user;
		};

		$ns->user_register = function() use ( $ns, $brithoncrm ) {
			$username = $_POST['username'];
			$password = $_POST['password'];
			$email = $_POST['email'];
			$first_name = $_POST['first_name'];
			$last_name = $_POST['last_name'];
			$org = $_POST['org'];

			if ( ! $username ) {
				$ns->return_error_msg( __( 'Empty username!', 'brithoncrm' ) );
			}
			if ( ! $password ) {
				$ns->return_error_msg( __( 'Empty password!', 'brithoncrm' ) );
			}
			if ( ! $email ) {
				$ns->return_error_msg( __( 'Empty email address!', 'brithoncrm' ) );
			}
			if ( ! $first_name ) {
				$ns->return_error_msg( __( 'First name required!', 'brithoncrm' ) );
			}
			if ( ! $last_name ) {
				$ns->return_error_msg( __( 'Last name required!', 'brithoncrm' ) );
			}
			if ( ! $org ) {
				$ns->return_error_msg( __( 'Organization required!', 'brithoncrm' ) );
			}

			$userdata = array(
				'user_login' => $username,
				'user_pass' => $password,
				'user_email' => $email,
				'display_name' => "$first_name $last_name",
				'nickname' => "$first_name $last_name",
				'first_name' => $first_name,
				'last_name' => $last_name,
				'organization' => $org
			);

			$user_id = wp_insert_user( $userdata );

			if ( ! is_wp_error( $user_id ) ) {
				add_user_meta( $user_id, 'organization', $org );
				$creds = array();
				$creds['user_login'] = $username;
				$creds['user_password'] = $password;
				$creds['remember'] = true;
				// $usr = wp_signon( $creds, false );
				$ns->global_signon( $creds );

				$ns->call_products_register( $userdata );
			} else {
				$ns->return_err_msg( $user_id->get_error_message( $user_id->get_error_code() ) );
			}
		};

		$ns->call_products_register = function( $creds ) use ( $ns ) {
			$products = $ns->get_products();

			foreach ( $products as $id => $item ) {
				$product_name = $item['name'];
				$ts = time();
				$token = $ns->create_token( $product_name, $ts );
				$creds = array(
					'creds' => $ns->encrypt( json_encode( $creds ), $token ),
					'token' => $token,
					'time' => $ts,
					'action' => 'brithoncrmx_register',
				);
				$resp = $ns->request( $ns->get_product_url( $product_name ).'/wp-admin/admin-ajax.php', 'POST', $creds );
				echo $resp;
			}

			die( json_encode( array(
						'referer' => isset( $_SERVER['HTTP_REFERER'] ) ? $_SERVER['HTTP_REFERER'] : '/'
					) ) );
		};

		$ns->is_woocommerce_on = function() use ( $ns ) {
			require_once admin_url( 'includes/plugin.php' );
			return is_plugin_active( 'woocommerce/woocommerce.php' );
		};

		$ns->is_wc_subscriptions_on = function() use ( $ns ) {
			require_once admin_url( 'includes/plugin.php' );
			return is_plugin_active( 'woocommerce-subscriptions/woocommerce-subscriptions.php' );
		};

		/**
		 * get_user_basic_info
		 *
		 * Get basic information of current user
		 *
		 * @return array(
		 *     'uid'     => Integer,    User ID,
		 *     'roles'    => Array of strings,  User roles,
		 *     'first_name'   => String,     First name,
		 *     'last_name'   => String,    Last name,
		 *     'username'   => String,    Username,
		 *     'email'    => String,    Email address,
		 *     'nicename'   => String,    Nice name (URL friendly),
		 *     'display_name'  => String,    Displayed name,
		 *     'url'    => String,    URL of the user,
		 *     'organization'  => String,    The organization of the user,
		 *     'customer_data'  => Associative array, Customer data. False when woocommerce is not activated.
		 *    Custoemr data:
		 *     'country'   => String,
		 *     'state'    => String,
		 *     'city'    => String,
		 *     'postcode'   => String,
		 *     'address'   => String,
		 *     'address_2'   => String,
		 *     'shipping_state' => String,
		 *     'shipping_city'  => String,
		 *     'shipping_country' => String,
		 *     'shipping_postcode' => String,
		 *     'shipping_address' => String,
		 *     'shipping_address_2'=> String,
		 *     'taxable_address' => **Array of strings** Array of taxable addresses,
		 *     'is_outside_base' => Boolean,    Indicates whether the customer is out of his/her base country,
		 *     'is_paying'   => Boolean,    If the user is paying,
		 *     'is_vat_exempt'  => Boolean
		 *    )
		 * @author Excelle Su
		 * */
		$ns->get_user_basic_info = function() use ( $ns ) {
			$current_user = wp_get_current_user();
			if ( $current_user === false ) {
				return false;
			}
			$info = array();
			$info['uid'] = $current_user->ID;
			$info['roles'] = $current_user->roles;
			$info['first_name'] = $current_user->first_name;
			$info['last_name'] = $current_user->last_name;
			$info['username'] = $current_user->user_login;
			$info['email'] = $current_user->user_email;
			$info['nicename'] = $current_user->user_nicename;
			$info['display_name'] = $current_user->display_name;
			$info['url'] = $current_user->user_url;
			$info['organization'] = get_user_meta( $current_user->ID, 'organization', true );

			if ( $ns->is_woocommerce_on() ) {
				$wc_customer = new WC_Customer();
				$customer_data = array(
					'country' => $wc_customer->get_country(),
					'state' => $wc_customer->get_state(),
					'city' => $wc_customer->get_city(),
					'postcode' => $wc_customer->get_postcode(),
					'address' => $wc_customer->get_address(),
					'address_2' => $wc_customer->get_address_2(),
					'shipping_state' => $wc_customer->get_shipping_state(),
					'shipping_country' => $wc_customer->get_shipping_country(),
					'shipping_city' => $wc_customer->get_shipping_city(),
					'shipping_postcode' => $wc_customer->get_shipping_postcode(),
					'shipping_address' => $wc_customer->get_shipping_address(),
					'shipping_address_2' => $wc_customer->get_shipping_address_2(),
					'taxable_address' => $wc_customer->get_taxable_address(),
					'is_outside_base' => $wc_customer->is_customer_outside_base(),
					'is_paying' => $wc_customer->is_paying_customer( $current_user->ID ),
					'is_vat_exempt' => $wc_customer->is_vat_exempt()
				);
			} else {
				$customer_data = false;
			}

			$info['customer_data'] = $customer_data;

			return $info;
		};

		/**
		 * retrieve_user_info
		 *
		 * The AJAX action retrieve_user_info
		 *
		 * @return void
		 * @author
		 * */
		$ns->retrieve_user_info = function () use ( $ns ) {
			$res = $ns->get_user_basic_info();
			if ( !$res ) {
				$ns->return_error_msg( 'Failed to retrieve user information. Not logged in.' );
			}
			die( json_encode( $res ) );
		};

		/**
		 * get_user_subscriptions ( $product )
		 *
		 * Get user's subscriptions information
		 *
		 * @return void
		 * @author
		 * */
		$ns->get_user_subscriptions = function( $product = '' ) use ( $ns ) {
			if ( $ns->is_wc_subscriptions_on() ) {
				$subs = WC_Subscriptions_Manager::get_users_subscriptions( get_current_user_id() );
				return $subs;
			} else {
				return false;
			}
		};

		$ns->retrieve_user_subscriptions = function() use ( $ns ) {
			$product = '';
			if ( isset( $_REQUEST['product'] ) ) {
				$product = $_REQUEST['product'];
			}

			$res = $ns->get_user_subscriptions( $product );
			if ( $res === false ) {
				$ns->return_error_msg( 'Failed to retireve subscriptions. WooCommerce Subscriptions is not activated' );
			}
			die( json_encode( $res ) );
		};

		/**
		 * get_user_order
		 *
		 * Get user's order records
		 *
		 * @return void
		 * @author Excelle Su
		 * */
		$ns->get_user_order = function( $product = '' ) use ( $ns ) {
			/*$customer_orders = get_posts( array(
			    'numberposts' => -1,
			    'meta_key'    => '_customer_user',
			    'meta_value'  => get_current_user_id(),
			    'post_type'   => wc_get_order_types(),
			    'post_status' => array_keys( wc_get_order_statuses() ),
			) );*/

			$wc_order = new WC_Order();
			$u = $wc_order->get_items();
			die( var_dump( $u ) );
		};

		$ns->retrieve_user_order = function() use ( $ns ) {
			$product = '';
			if ( isset( $_REQUEST['product'] ) ) {
				$product = $_REQUEST['product'];
			}

			die( json_encode( $ns->get_user_order( $product ) ) );
		};

		$ns->add_product = function( $name, $description ) use ( $ns, $brithoncrm ) {
			global $birchpress;

			return wp_insert_post( array(
					'post_type' => 'product',
					'post_title' => $name,
					'post_content' => $description,
				), true );
		};

		$ns->get_products = function() use ( $ns ) {
			global $birchpress;

			$result = array();

			$query = new WP_Query( array(
					'post_type' => 'product',
				) );

			while ( $query->have_posts() ) {
				$query->the_post();
				array_push( $result, array(
						'id' => get_the_ID(),
						'name' => the_title( '', '', false ),
						'description' => get_the_content()
					) );
			}

			return $result;
		};

		$ns->edit_product = function( $id, $name, $description ) use ( $ns ) {
			global $birchpress;

			return wp_insert_post( array(
					'ID' => $id,
					'post_type' => 'product',
					'post_title' => $name,
					'post_content' => $description,
				), true );
		};

		$ns->delete_product = function( $id ) use ( $ns ) {
			return wp_delete_post( $id, true );
		};

		$ns->test_set_product = function() use ( $ns ) {
			$products = $ns->get_products();
			if ( count( $products ) == 0 ) {
				$ns->add_product( 'appointments', 'Birchpress appointments' );
				die( 'Birchpress appointments has been set. ' );
			} else {
				die( 'Product has already set. ' );
			}
		};

		$ns->get_product_url = function( $product_name ) use ( $ns ) {
			$host = $_SERVER['HTTP_HOST'];
			$components = explode( '.', $host, 2 );
			$subdomains = explode( '-', $components[0] );
			$domain = $components[1];
			$domain = explode( ':', $domain, 2 )[0];
			$env = '';
			$result = '';

			if ( count( $subdomains ) < 2 ) {
				$env = 'PROD';
			} else {
				if ( $subdomains[1] === 'dev' ) {
					$env = 'DEV';
				}
				if ( $subdomains[1] === 'local' ) {
					$env = 'LOCAL';
				}
			}

			switch ( $env ) {
			case 'PROD':
				$result = "https://$product_name.$domain";
				break;

			case 'DEV':
				$result = "https://$product_name-dev.$domain";

			case 'LOCAL':
				$result = "http://$product_name-local.$domain";
				break;

			default:
				$result = "https://$product_name.$domain";
				break;
			}

			return $result;
		};

		$ns->request = function( $url, $method, $data, $accept='*/*' ) use ( $ns ) {
			if ( gettype( $data ) === 'array' ) {
				$query_str = '';
				foreach ( $data as $key => $value ) {
					$key = urlencode( $key );
					$value = urlencode( $value );
					$query_str .= "$key=$value&";
				}
				$data = $query_str;
			}

			$context = array(
				'http' => array(
					'method' => $method,
					'header' => "Accept: $accept",
					'content' => $data,
				)
			);
			$context = stream_context_create( $context );
			return file_get_contents( $url, false, $context );
		};

		$ns->return_error_msg = function( $msg ) use ( $ns ) {
			die( json_encode( array(
						'message' => $msg,
					) ) );
		};

		$ns->remote_error_handler = function() use ( $ns ) {
			die( json_encode( array(
						'message' => $_POST['message'],
					) ) );
		};
	} );
