<?php

$parse_uri = explode( 'wp-content', $_SERVER['SCRIPT_FILENAME'] );
require_once( $parse_uri[0] . 'wp-load.php' );

birch_ns( 'brithoncrm.subscriptions.register', function( $ns ) {

        global $brithoncrm;

        $ns->init = function() use ( $ns ) {
            $action = $_POST['action'];
            if( isset($_POST['action']) && $action=='reg' ) {
                $username = $_POST['username'];
                $password = $_POST['password'];
                $email = $_POST['email'];
                $first_name = $_POST['first_name'];
                $last_name = $_POST['last_name'];
                $org = $_POST['org'];

                if( !$username ) {
                    $ns->return_err_msg('Empty username!');
                } 
                if ( !$password ) {
                    $ns->return_err_msg('Empty password!');
                } 
                if ( !$email ) {
                    $ns->return_err_msg('Empty email address!');
                }
                if ( !$first_name ) {
                    $ns->return_err_msg('First name required!');
                }
                if ( !$last_name ) {
                    $ns->return_err_msg('Last name required!');
                }
                if ( !$org ) {
                    $ns->return_err_msg('Organization required!');
                }

                $userdata = array(
                    'user_login'  =>  $username,
                    'user_pass'   =>  $password,
                    'user_email'  =>  $email,
                    'display_name'=>  "$first_name $last_name",
                    'nickname'    =>  "$first_name $last_name",
                    'first_name'  =>  $first_name,
                    'last_name'   =>  $last_name
                )
                $uid = wp_insert_user( $userdata );

                if( !is_wp_error( $uid ) ) {
                    add_user_meta( $uid, 'organization', $org );

                    $site_id = wpmu_create_blog( get_clean_basedomain(), 
                        $username, "$first_name $last_name", $uid);

                    if( !is_wp_error( $site_id ) ) {
                        echo json_encode(
                            array(
                                'user_id' => $uid,
                                'site_id' => $site_id
                        ));
                    } else {
                        return_err_msg( $site_id.get_error_message( $site_id.get_error_code() ) );
                    }
                } else {
                    return_err_msg( $uid.get_error_message( $uid.get_error_code() ) );
                }
            }
        };

        $ns->return_err_msg = function($msg) use ( $ns ) {
            die("{'message':'$msg'}");
        };
} );
