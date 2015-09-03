<?php

birch_ns( 'brithoncrm.registration.view.i18n', function( $ns ) {

        global $brithoncrm;

        $ns->init = function() use ( $ns ) {

        };

        $ns->get_original_strings = function() use ( $ns ) {
            $str = array(
                "Log in",

                "Register",

                "Empty username!",

                "Empty password!",

                "Empty email address!",

                "First name required!",

                "Last name required!",

                "Organization required!",

                "First Name",

                "Last Name",

                "Email address",

                "Organization",

                "Submit",

                "Reset",

                "Network error",

                "Password",

                "Welcome to register"

            );
            return $str;
        };

        $ns->get_i18n_strings = function() use ( $ns ) {
            $src = $ns->get_original_strings();
            $result = array();
            foreach ( $src as $item ) {
                $key = str_replace( ' ', '_', $item );
                $result = array_merge( $result, array( $key => __( $item, 'brithoncrm-registration' ) ) );
            }
            return $result;
        };
    } );
