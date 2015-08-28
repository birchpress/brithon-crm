<?php

require __DIR__.'/vendor/autoload.php';

birch_ns( 'brithoncrm.subscriptions', function( $ns ) {

		global $brithoncrm;

		$ns->init = function() use ( $ns ) {

		};

		$ns->wp_init = function() use ( $ns, $brithoncrm ) {
			global $birchpress;

		};

} );
