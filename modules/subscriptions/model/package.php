<?php

birch_ns( 'brithoncrm.subscriptions.model', function( $ns ) {

		global $brithoncrm;

		$ns->init = function() use ( $ns ) {
			register_activation_hook( __FILE__, array( $ns, 'plugin_init' ) );
			add_action( 'init', array( $ns, 'wp_init' ) );
		};

		$ns->wp_init = function() use ( $ns, $brithoncrm ) {
			global $birchpress;

			if ( is_main_site() ) {
				add_action( 'wp_ajax_birchpress_subscriptions_getplans', array( $ns, 'retrieve_all_plans' ) );
				add_action( 'wp_ajax_birchpress_subscriptions_getcustomer', array( $ns, 'retrieve_customer_info' ) );
				add_action( 'wp_ajax_birchpress_subscriptions_regcustomer', array( $ns, 'register_customer' ) );
				add_action( 'wp_ajax_birchpress_subscriptions_updateplan', array( $ns, 'update_user_plan' ) );
				add_action( 'wp_ajax_birchpress_subscriptions_updatecard', array( $ns, 'update_user_card' ) );
			}
		};

		$ns->plugin_init = function() use ( $ns ) {
			register_post_type( 'subscription' );
		};

		$ns->return_err_msg = function( $msg, $error = 'Error' ) use ( $ns ) {
			die( json_encode( array(
						'error' => $error,
						'message' => $msg,
					) ) );
		};

		$ns->return_result = function( $succeed, $data ) use ( $ns ) {
			return array(
				'succeed' => $succeed,
				'data' => $data,
			);
		};

		$ns->get_max_providers = function( $plan_id ) use ( $ns ) {
			if ( $plan_id == 1 ) {
				return 1;
			} else if ( $plan_id == 2 ) {
				return 5;
			} else if ( $plan_id == 3 ) {
				return 10;
			} else if ( $plan_id == 4 ) {
				return 20;
			} else {
				return 0;
			}
		};

		$ns->retrieve_all_plans = function() use ( $ns ) {
			$res = $ns->get_all_plans();
			if ( $res['succeed'] ) {
				die( json_encode( $res['data'] ) );
			} else {
				$ns->return_err_msg( $res['data'] );
			}
		};

		$ns->retrieve_customer_info = function() use ( $ns ) {
			$uid = get_current_user_id();
			$blog_id = get_current_blog_id();
			$result = array();
			$sub_info = $ns->query_subscription( $uid );
			if ( $sub_info ) {
				$result = array_merge( $result, array(
						'user_id' => $uid,
						'blog_id' => $blog_id,
						'customer_token' => $sub_info->customer_token,
					) );

				$token = $sub_info->customer_token;
				if ( $token ) {
					// Check subscription validity
					if ( $ns->check_subscription( $sub_info ) ) {
						$result = array_merge( $result, array(
								'plan_id' => $sub_info->plan_id,
								'plan_desc' => $sub_info->plan_desc,
								'plan_max_providers' => $sub_info->plan_max_providers,
								'plan_charge' => $sub_info->plan_charge,
								'expire_date' => $sub_info->plan_period_end,
							) );
					}
					$cards = $ns->get_cards( $token );
					if ( $cards ) {
						$card = $cards[0];
						$result = array_merge( $result, array(
								'has_card' => true,
								'card_last4' => $card->last4,
								'card_id' => $card->id,
							) );
					} else {
						$result = array_merge( $result, array(
								'has_card' => false,
							) );
					}
				}
				die( json_encode( $result ) );
			} else {
				$ns->return_err_msg( 'User does not exist.' );
			}
		};

		$ns->register_customer = function() use ( $ns ) {
			if ( isset( $_POST['stripe_token'] ) ) {
				$stripe_token = $_POST['stripe_token'];
				$email = $_POST['email'];
				$res = $ns->create_customer( $stripe_token, $email );
				if ( $res['succeed'] ) {
					$ns->register_subscription_to_db( 0, $res['data'] );
					die( json_encode( array( 'id' => $res['data'] ) ) );
				} else {
					$ns->return_err_msg( $res['data'] );
				}
			}
		};

		$ns->update_user_plan = function() use ( $ns ) {
			if ( isset( $_POST['plan_id'] ) ) {
				$plan_id = $_POST['plan_id'];
				$sub_info = $ns->query_subscription();
				$cus_token = $sub_info->customer_token;
				if ( $cus_token ) {
					$card = $ns->get_cards( $cus_token );
					if ( $card ) {
						$sub = $ns->set_customer_plan( $cus_token, $plan_id );
						if ( $sub['succeed'] ) {
							$ns->register_subscription_to_db( $plan_id, $cus_token, $sub['data'] );
						}
						die( json_encode( $card ) );
					} else {
						$ns->return_err_msg( 'No credit card.' );
					}
				} else {
					$ns->return_err_msg( 'No customer info.' );
				}
			}
		};

		$ns->update_user_card = function() use ( $ns ) {
			if ( isset( $_POST['stripe_token'] ) ) {
				$sub_info = $ns->query_subscription();
				if ( $sub_info->customer_token ) {
					$cus_token = $sub_info->customer_token;
					$stripe_token = $_POST['stripe_token'];
					$res = $ns->set_customer_card( $cus_token, $stripe_token );
					if ( $res['succeed'] ) {
						die( json_encode( $sub_info ) );
					} else {
						$ns->return_err_msg( $res['data'] );
					}
				} else {
					$ns->return_err_msg( 'No customer info.' );
				}
			}
		};

		$ns->register_subscription_to_db = function( $plan_id, $customer_token, $subscription = null ) use ( $ns ) {
			$info = array(
				'blog_id' => get_current_blog_id(),
				'plan_id' => $plan_id,
				'customer_token' => $customer_token,
			);
			if ( $subscription ) {
				$info = array_merge( $info, array(
						'plan_desc' => $subscription->plan->name,
						'plan_charge' => $subscription->plan->amount,
						'plan_max_providers' => $ns->get_max_providers( $plan_id ),
						'plan_period_end' => $subscription->current_period_end
					) );
			}
			$post_id = wp_insert_post(
				array(
					'post_content' => json_encode( $info ),
					'post_name' => 'subscription',
					'post_title' => 'Subscription',
					'post_excerpt' => '',
					'post_type' => 'subscription',
				), false
			);
			return add_post_meta( $post_id, 'validate_time', date( 'Y-m-d H:i:s' ) );
		};

		$ns->query_subscription = function() use ( $ns ) {
			$query = new WP_Query( array(
					'author__in' => get_current_user_id(),
					'post_type' => 'subscription',
					'orderby' => 'date',
					'order' => 'DESC',
				) );
			if ( ! $query->post_count ) {
				return false;
			} else {
				$query->the_post();
				return json_decode( get_the_content() );
			}
		};

		$ns->check_subscription = function( $subscription ) use ( $ns ) {
			if ( isset( $subscription->plan_period_end ) ) {
				if ( $subscription->plan_period_end > time() ) {
					return true;
				}
			}
			if ( isset( $subscription->customer_token ) ) {
				$subscription_on_server = $ns->get_customer_plan( $subscription->customer_token );
				if ( ! $subscription_on_server['succeed'] ) {
					return false;
				}
				if ( $subscription_on_server['data']->current_period_end >= time() ) {
					$ns->register_subscription_to_db( $subscription->plan_id, $subscription->customer_token, $subscription_on_server['data'] );
					return true;
				}
			} else {
				return false;
			}
			return false;
		};

		$ns->query_sub_records = function( $uid ) use ( $ns ) {
			$query = new WP_Query( array(
					'author__in' => get_current_user_id(),
					'post_type' => 'subscription',
					'orderby' => 'date',
					'order' => 'DESC',
				) );
			$res = array();
			while ( $query->have_posts() ) {
				$query->the_post();
				$post_id = the_ID();
				array_push( $res, get_post_meta( $post_id, 'validate_time' ) );
			}
			return $res;
		};

		$ns->get_stripe_publishable_key = function() use ( $ns ) {
			return 'pk_test_UXg1SpQF3oMNygpdyln3cokz';
		};

		$ns->get_stripe_private_key = function() use ( $ns ) {
			return 'sk_test_zk5XKLEhfi6nyfmCcxxFM2bQ';
		};

		$ns->charge_user = function( $amount, $description, $data ) use ( $ns ) {
			\Stripe\Stripe::setApiKey( $ns->get_stripe_private_key() );

			$info = array_merge( array(
					'amount' => $amount,
					'currency' => 'USD',
					'description' => $description,
				), $data );

			try {
				$charge = \Stripe\Charge::create( $info );
				return $ns->return_result( true, $charge );
			} catch ( \Stripe\Error\Card $e ) {
				return $ns->return_result( false, $e->getMessage() );
			}
		};

		$ns->charge_user_once = function( $card_token, $amount, $description ) use ( $ns ) {
			return $ns->charge_user( $amount, $description, array( 'source' => $card_token ) );
		};

		$ns->charge_user_from_id = function( $customer_token, $amount, $description ) use ( $ns ) {
			return $ns->charge_user( $amount, $description, array( 'customer' => $customer_token ) );
		};

		$ns->create_customer = function( $stripe_token, $email ) use ( $ns ) {
			\Stripe\Stripe::setApiKey( $ns->get_stripe_private_key() );

			try {
				$customer = \Stripe\Customer::create( array(
						'source' => $stripe_token,
						'email' => $email,
						'metadata' => array( 'user_id' => get_current_user_id() ),
					) );
				return $ns->return_result( true, $customer->id );

			} catch ( \Stripe\Error $e ) {
				return $ns->return_result( false, $e->getMessage() );
			}
		};

		$ns->get_customer = function( $customer_token ) use ( $ns ) {
			\Stripe\Stripe::setApiKey( $ns->get_stripe_private_key() );

			try {
				$customer = \Stripe\Customer::retrieve( $customer_token );
				return $ns->return_result( true, $customer );
			} catch ( \Stripe\Error $e ) {
				return $ns->return_result( false, $e->getMessage() );
			}
		};

		$ns->get_cards = function( $customer_token ) use ( $ns ) {
			$result = $ns->get_customer( $customer_token );
			if ( $result['succeed'] && $result['data']->sources ) {
				return $result['data']->sources->all( array( 'limit' => 1, 'object' => 'card' ) )['data'];
			} else {
				return false;
			}
		};

		$ns->set_customer_card = function( $customer_token, $stripe_token ) use ( $ns ) {
			\Stripe\Stripe::setApiKey( $ns->get_stripe_private_key() );

			$res = $ns->get_customer( $customer_token );
			if ( $res['succeed'] ) {
				$customer = $res['data'];
				try {
					$customer->source = $stripe_token;
					$customer->save();
					return $ns->return_result( true, true );
				} catch ( \Stripe\Error $e ) {
					return $ns->return_result( false, $e->getMessage() );
				}
			} else {
				return $res;
			}
		};

		$ns->set_customer_plan = function( $customer_token, $plan_id ) use ( $ns ) {
			\Stripe\Stripe::setApiKey( $ns->get_stripe_private_key() );

			try {
				$customer = \Stripe\Customer::retrieve( $customer_token );
				$subs_list = $customer->subscriptions->all()['data'];
				if ( ! $subs_list ) {
					$new_sub = $customer->subscriptions->create( array( 'plan' => $plan_id ) );
					return $ns->return_result( true, $new_sub );
				} else {
					$current_sub = $subs_list[0];
					$current_sub->plan = $plan_id;
					$current_sub->save();
					return $ns->return_result( true, $current_sub );
				}
			} catch ( \Stripe\Error $e ) {
				return $ns->return_result( false, $e->getMessage() );
			}
		};

		$ns->get_customer_plan = function( $customer_token ) use ( $ns ) {
			\Stripe\Stripe::setApiKey( $ns->get_stripe_private_key() );

			try {
				$customer = \Stripe\Customer::retrieve( $customer_token );
				if ( ! $customer ) {
					return $ns->return_result( false, 'Invalid customer token.' );
				}

				$subs_list = $customer->subscriptions->all()['data'];
				if ( ! $subs_list ) {
					return $ns->return_result( false, 'No subscription found.' );
				}
				$current_subscription = $subs_list[0];

				return $ns->return_result( true, $current_subscription );
			} catch ( \Stripe\Error $e ) {
				return $ns->return_result( false, $e->getMessage() );
			}
		};

		$ns->get_all_plans = function() use ( $ns ) {
			\Stripe\Stripe::setApiKey( $ns->get_stripe_private_key() );
			global $wpdb;

			$result = array();
			try {
				$plans = \Stripe\Plan::all();
				$plans = $plans['data'];

				foreach ( $plans as $item ) {
					array_push( $result, array(
							'id' => $item->id,
							'desc' => $item->name,
							'charge' => $item->amount,
							'trial_days' => $item->trial_period_days,
						) );
				}
				return $ns->return_result( true, $result );
			} catch ( \Stripe\Error $e ) {
				return $ns->return_result( false, $e->getMessage() );
			}
		};

		$ns->get_certain_plan = function( $id ) use ( $ns ) {
			$res = $ns->get_all_plans();
			if ( $res['succeed'] ) {
				foreach ( $res['data'] as $item ) {
					if ( $item['id'] == $id ) {
						return $item;
					}
				}
			}
			return false;
		};
	} );
