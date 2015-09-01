<?php

birch_ns( 'brithoncrm.common', function( $ns ) {

        global $brithoncrm;

        $ns->init = function() use ( $ns ) {

        };

        $ns->wp_init = function() use ( $ns, $brithoncrm ) {
            global $birchpress;

        };

} );
