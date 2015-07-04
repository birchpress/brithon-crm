<?php

birch_ns( 'brithoncrm.subscriptions', function( $ns ) {

		global $brithoncrm;

		$ns->init = function() use ( $ns ) {
			add_action( 'init', array( $ns, 'wp_init' ) );
			add_action( 'admin_init', array( $ns, 'wp_admin_init' ) );
		};

		$ns->wp_init = function() use ( $ns ) {

		};

		$ns->wp_admin_init = function() use ( $ns ) {

		};
	} );
