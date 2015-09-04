<?php

birch_ns( 'brithoncrm.registration.view.i18n', function( $ns ) {

        global $brithoncrm;

        $ns->init = function() use ( $ns ) {

        };

        $ns->get_i18n_strings = function() use ( $ns ) {
            $str = array(
                "Log_in" => __('Log in', 'brithoncrm-registration'),

                "Register" => __('Register', 'brithoncrm-registration'),

                "Empty_username!" => __('Empty username!', 'brithoncrm-registration'),

                "Empty_password!" => __('Empty password!', 'brithoncrm-registration'),

                "Empty_email_address!" => __('Empty email address!', 'brithoncrm-registration'),

                "First_name_required!" => __('First name required!', 'brithoncrm-registration'),

                "Last_name_required!" => __('Last name required!', 'brithoncrm-registration'),

                "Organization_required!" => __('Organization required!', 'brithoncrm-registration'),

                "First_Name" => __('First Name', 'brithoncrm-registration'),

                "Last_Name" => __('Last Name', 'brithoncrm-registration'),

                "Email_address" => __('Email address', 'brithoncrm-registration'),

                "Organization" => __('Organization', 'brithoncrm-registration'),

                "Submit" => __('Submit', 'brithoncrm-registration'),

                "Reset" => __('Reset', 'brithoncrm-registration'),

                "Network_error" => __('Network error', 'brithoncrm-registration'),

                "Password" => __('Password', 'brithoncrm-registration'),

                "Welcome_to_register" => __('Welcome to register', 'brithoncrm-registration')

            );
            return $str;
        };
    } );
