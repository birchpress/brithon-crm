<?php

birch_ns( 'brithoncrm.common', function( $ns ) {

        global $brithoncrm;

        $ns->init = function() use ( $ns ) {
            add_action('init', array($ns, 'wp_init'));
        };

        $ns->wp_init = function() use ( $ns, $brithoncrm ) {
            global $birchpress;

        };

} );
