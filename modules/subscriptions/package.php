<?php

require(__DIR__.'/vendor/autoload.php');

birch_ns( 'brithoncrm.subscriptions', function( $ns ) {

        global $brithoncrm;

        $ns->init = function() use ( $ns ) {
            register_activation_hook(__FILE__, array($ns, 'plugin_init'));
            add_action( 'init', array( $ns, 'wp_init' ) );
            add_action( 'admin_init', array( $ns, 'wp_admin_init' ) );
            add_action( 'admin_menu', array( $ns, 'create_admin_menus' ) );
            add_action( 'widgets_init', array( $ns, 'register_widgets' ) );
        };

        $ns->plugin_init = function() use ($ns) {
            register_post_type('subscription');
        };

        $ns->wp_init = function() use ( $ns, $brithoncrm ) {
            global $birchpress;

            $bp_urls = array(
                'ajax_url' => admin_url( 'admin-ajax.php' ),
                'admincp_url' => admin_url()
            );
            $bp_uid = array('uid' => get_current_user_id());

            if ( is_main_site() ) {
                $birchpress->view->register_3rd_scripts();
                $birchpress->view->register_core_scripts();
                wp_enqueue_style( 'brithoncrm_subscriptions_base',
                    $brithoncrm->plugin_url() . '/modules/subscriptions/assets/css/base.css' );
                wp_enqueue_style( 'brithoncrm_subscriptions_app',
                    $brithoncrm->plugin_url() . '/modules/subscriptions/assets/css/app.css' );
                wp_register_script( 'brithoncrm_subscriptions_index',
                    $brithoncrm->plugin_url() . '/modules/subscriptions/assets/js/index.bundle.js',
                    array( 'birchpress', 'react-with-addons', 'immutable' ) );
                wp_localize_script( 'brithoncrm_subscriptions_index', 'bp_urls', $bp_urls );
                wp_localize_script('brithoncrm_subscriptions_index', 'bp_uid', $bp_uid);
                add_action( 'wp_ajax_nopriv_register_birchpress_account', array( $ns, 'register_account' ) );
                add_action('wp_ajax_nopriv_birchpress_subscriptions_getplans', array($ns, 'retrieve_all_plans'));
                add_action('wp_ajax_nopriv_birchpress_subscriptions_getcustomer', array($ns, 'retrieve_customer_info'));

                wp_enqueue_script( 'brithoncrm_subscriptions_index' );
            }
        };

        $ns->wp_admin_init = function() use ( $ns, $brithoncrm ) {

        };

        $ns->register_widgets = function() use ($ns) {
            wp_register_sidebar_widget( 'birchpress-register-form', 'User Area', array( $ns, 'render_registration_widget' ),
                array(
                    'description' => 'Register a new account'
                ) );
        };

        $ns->create_admin_menus = function() use ( $ns ) {
            add_menu_page( 'Billing and invoices', 'Settings', 'read',
                'brithoncrm/subscriptions', array( $ns, 'render_setting_page' ), '', 81 );
        };
        $ns->render_setting_page = function() use ( $ns ) {
?>
            <h3>Billing and invoices</h3>
            <section id="birchpress-settings"></section>
<?php
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

        $ns->register_account = function() use ( $ns ) {

            $username = $_POST['username'];
            $password = $_POST['password'];
            $email = $_POST['email'];
            $first_name = $_POST['first_name'];
            $last_name = $_POST['last_name'];
            $org = $_POST['org'];

            if ( !$username ) {
                $ns->return_err_msg( 'Empty username!' );
            }
            if ( !$password ) {
                $ns->return_err_msg( 'Empty password!' );
            }
            if ( !$email ) {
                $ns->return_err_msg( 'Empty email address!' );
            }
            if ( !$first_name ) {
                $ns->return_err_msg( 'First name required!' );
            }
            if ( !$last_name ) {
                $ns->return_err_msg( 'Last name required!' );
            }
            if ( !$org ) {
                $ns->return_err_msg( 'Organization required!' );
            }

            $userdata = array(
                'user_login'  =>  $username,
                'user_pass'   =>  $password,
                'user_email'  =>  $email,
                'display_name'=>  "$first_name $last_name",
                'nickname'    =>  "$first_name $last_name",
                'first_name'  =>  $first_name,
                'last_name'   =>  $last_name
            );

            $user_id = wp_insert_user( $userdata );
            $subdir = $ns->generate_blog_dir( $first_name, $last_name );

            if ( !is_wp_error( $user_id ) ) {
                add_user_meta( $user_id, 'organization', $org );
                $site_id = wpmu_create_blog( $ns->get_clean_basedomain(),
                    $subdir, "$first_name $last_name", $user_id );
                $ns->register_subscription_to_db($user_id, 0, 0, 0, 0, 1, '');

                if ( !is_wp_error( $site_id ) ) {
                    $creds = array();
                    $creds['user_login'] = $username;
                    $creds['user_password'] = $password;
                    $creds['remember'] = true;
                    $usr = wp_signon( $creds, false );

                    die( json_encode(
                            array(
                                'user_id' => $user_id,
                                'site_id' => $site_id,
                                'site_dir' => $subdir
                            ) ) );
                } else {
                    $ns->return_err_msg( $site_id->get_error_message( $site_id->get_error_code() ) );
                }
            } else {
                $ns->return_err_msg( $user_id->get_error_message( $user_id->get_error_code() ) );
            }
        };

        $ns->return_err_msg = function( $msg ) use ( $ns ) {
            die( "{'message':'$msg'}" );
        };

        $ns->return_result = function( $succeed, $data ) use ( $ns ) {
            return array(
                'succeed' => $succeed,
                'data' => $data
            );
        };

        $ns->get_clean_basedomain = function() use ( $ns ) {
            $domain = preg_replace( '|https?://|', '', site_url() );
            if ( $slash = strpos( $domain, '/' ) ) {
                $domain = substr( $domain, 0, $slash );
            }
            return $domain;
        };

        $ns->generate_blog_dir = function( $first_name, $last_name ) use ( $ns ) {
            return '/'.$first_name.'_'.$last_name.rand();
        };

        $ns->get_max_providers = function($plan_id) use ($ns) {
            if($plan_id == 1){
                return 1;
            } else if($plan_id == 2){
                return 5;
            } else if($plan_id == 3){
                return 10;
            } else if($plan_id == 4){
                return 20;
            } else {
                return 0;
            }
        };

        $ns->retrieve_all_plans = function() use ($ns) {
            $res = $ns->get_all_plans();
            if($res['succeed']){
                die(json_encode($res['data']));
            } else {
                return_err_msg($res['data']);
            }
        };

        $ns->retrieve_customer_info = function() use ($ns) {
            if(!isset($_POST['uid'])){
                return_err_msg('Missing UID');
            }
            $uid = $_POST['uid'];
            $result = array();
            $user_info = $ns->query_subscription($uid);
            if($user_info) {
                array_push($result, array(
                    'user_id' => $uid,
                    'plan_id' => $user_info->plan_id,
                    'plan_charge' => $user_info->plan_charge,
                    'plan_max_providers' => $user_info->plan_max_providers,
                    'expire_date' => $user_info->expire_date,
                    'customer_token' => $user_info->customer_token
                ));
                
                $token = $user_info->customer_token;
                if($token){
                    $cards = $ns->get_cards($token);
                    if($cards){
                        $card = $cards[0];
                        array_push($result, array(
                            'has_card' => true,
                            'card_last4' => $card->last4,
                            'card_id' => $card->id
                        ));
                    } else {
                        array_push($result, array(
                            'has_card' => false
                        ));
                    }
                }
                die(json_encode($result));
            } else {
                return_err_msg('User does not exist.');
            }
        };

        $ns->register_subscription_to_db = function( $plan_id, $customer_token ) use ( $ns ) {
            $plan = $ns->get_certain_plan($paln_id);
            $info = array(
                'blog_id' => get_current_blog_id(),
                'plan_id' => $plan_id,
                'plan_charge' => $plan['charge'],
                'plan_max_providers' => get_max_providers($plan_id),
                'plan_desc' => $plan['desc'],
                'customer_token' => $customer_token
            );
            $post_id = wp_insert_post(
                array(
                    'post_content' => json_encode($info),
                    'post_name' => 'subscription',
                    'post_title' => 'Subscription',
                    'post_excerpt' => '',
                    'post_type' => 'subscription'
                ), false
            );
            return wp_add_post_meta($post_id, 'validate_time', date('Y-m-d H:i:s'));
        };

        $ns->query_subscription = function() use ( $ns ) {
            $query = new WP_Query(array(
                'author__in' => get_current_user_id(),
                'post_type' => 'subscription',
                'orderby' => 'date',
                'order' => 'DESC'
            ));
            if(!$query->post_count){
                return false;
            } else {
                $query->the_post();
                return json_decode(get_the_content());
            }
        };

        $ns->query_sub_records = function( $uid ) use ( $ns ) {
            $query = new WP_Query(array(
                'author__in' => get_current_user_id(),
                'post_type' => 'subscription',
                'orderby' => 'date',
                'order' => 'DESC'
            ));
            $res = array();
            while ($query->have_posts()) {
                $query->the_post();
                $post_id = the_ID();
                array_push($res, get_post_meta($post_id, 'validate_time'));
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
            \Stripe\Stripe::setApiKey( $ns->get_stripe_private_key );

            $info = array_merge( array(
                    'amount' => $amount,
                    'currency' => 'USD',
                    'description' => $description
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

        $ns->create_customer = function( $stripe_token, $email, $user_id ) use ( $ns ) {
            \Stripe\Stripe::setApiKey( $ns->get_stripe_private_key );

            try {
                $customer = \Stripe\Customer::create( array(
                        'source' => $stripe_token,
                        'email' => $email,
                        'metadata' => array( 'user_id' => $user_id )
                    ) );
                return $ns->return_result( true, $customer->id );

            } catch ( \Stripe\Error $e ) {
                return $ns->return_result( false, $e->getMessage() );
            }
        };

        $ns->get_customer = function($customer_token) use ($ns) {
            \Stripe\Stripe::setApiKey( $ns->get_stripe_private_key );

            try {
                $customer = \Stripe\Customer::retrieve( $customer_token );
                return $ns->return_result( true, $customer );
            } catch ( \Stripe\Error $e ) {
                return $ns->return_result( false, $e->getMessage() );
            }
        };

        $ns->get_cards = function($customer_token) use ($ns) {
            $result = $ns->get_customer($customer_token);
            if($result['succeed']){
                return $result['data']->sources->all(array('limit' => 1,'object' => 'card'))['data'];
            } else {
                return false;
            }
        };

        $ns->set_customer_card = function($customer_token, $stripe_token) use ($ns) {
            \Stripe\Stripe::setApiKey( $ns->get_stripe_private_key );

            $res = $ns->get_customer($customer_token);
            if($res['succeed']){
                $customer = $res['data'];
                try {
                    $customer->source = $stripe_token;
                    $customer->save();
                    return $ns->return_result(true, true);
                } catch (\Stripe\Error $e) {
                    return $ns->return_result(false, $e->getMessage());
                }
            } else {
                return $res;
            }
        };

        $ns->set_customer_plan = function( $customer_token, $plan_id ) use ( $ns ) {
            \Stripe\Stripe::setApiKey( $ns->get_stripe_private_key );

            try {
                $customer = \Stripe\Customer::retrieve( $customer_token );
                $subs_list = $customer->subscriptions->all()['data'];
                if(!$subs_list){
                    $new_sub = $customer->subscriptions->create(array('plan' => $plan_id));
                    return $ns->return_result( true, $new_sub->id );
                } else {
                    $current_sub = $subs_list[0];
                    $current_sub->plan = $paln_id;
                    $current_sub->save();
                    return $ns->return_result(true, $current_sub->id);
                }
            } catch ( \Stripe\Error $e ) {
                return $ns->return_result( false, $e->getMessage() );
            }
        };

        $ns->get_all_plans = function() use ( $ns ) {
            \Stripe\Stripe::setApiKey( $ns->get_stripe_private_key );
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
                            'trial_days' => $item->trial_period_days
                        ) );
                }
                return $ns->return_result( true, $result );
            } catch ( \Stripe\Error $e ) {
                return $ns->return_result( false, $e->getMessage() );
            }
        };

        $ns->get_certain_plan = function($id) use ($ns) {
            $res = $ns->get_all_plans();
            if($res['succeed']){
                foreach ($res['data'] as $item) {
                    if($item['id'] == $id){
                        return $item;
                    }
                }
            }
            return false;
        };
    } );
