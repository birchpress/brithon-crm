<?php

birch_ns( 'brithoncrm.subscriptions.view.i18n', function( $ns ) {

        global $brithoncrm;

        $ns->init = function() use ( $ns ) {

        };

        $ns->get_original_strings = function() use ( $ns ) {
            $str = array(
                "Billing and invoices",

                "User does not exist.",

                "No credit card.",

                "No customer info.",

                "Change or update your credit card",

                "Changes to your credit card will be effective immediately.",

                "All future charges will be charged to this card.",

                "Thanks for updating your billing information.",

                "Hide",

                "Change your credit card and billing information",

                "See plans and upgrade or downgrade",

                "Choose plan",

                "Your next charge is $%s on %s",

                "Purchase completed.",

                "You are currently on a trial subscription.",

                "Buy subscription",

                "Trial",

                "Purchase",

                "Update My Card",

                "Your credit card on file is",

                "$%s / month - %s Service providers",

                "Current plan:",

                "Credit card",

                "Update Complete - Plan",

                "Purchase failed - ",

                "Update"
            );
            return $str;
        };

        $ns->get_i18n_strings = function() use ( $ns ) {
            $src = $ns->get_original_strings();
            $result = array();
            foreach ( $src as $item ) {
                $key = str_replace(' ', '_', $item);
                $result = array_merge( $result, array( $key => __( $item, 'brithoncrm-subscriptions' ) ) );
            }
            return $result;
        };
    } );
