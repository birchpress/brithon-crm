<?php

birch_ns( 'brithoncrm', function( $ns ) {

		$_ns_data = new stdClass();

		birch_defn( $ns, 'set_product_version', function( $product_version ) use ( $ns, $_ns_data ) {
				$_ns_data->product_version = $product_version;
			} );

		birch_defn( $ns, 'get_product_version', function() use ( $ns, $_ns_data ) {
				return $_ns_data->product_version;
			} );

		birch_defn( $ns, 'set_product_name', function( $product_name ) use ( $ns, $_ns_data ) {
				$_ns_data->product_name = $product_name;
			} );

		birch_defn( $ns, 'get_product_name', function() use ( $ns, $_ns_data ) {
				return $_ns_data->product_name;
			} );

		birch_defn( $ns, 'set_product_code', function( $product_code ) use ( $ns, $_ns_data ) {
				$_ns_data->product_code = $product_code;
			} );

		birch_defn( $ns, 'get_product_code', function() use ( $ns, $_ns_data ) {
				return $_ns_data->product_code;
			} );

		birch_defn( $ns, 'set_plugin_file_path', function ( $plugin_file_path )
			use( $ns, $_ns_data ) {

				$_ns_data->plugin_file_path = $plugin_file_path;
			} );

		birch_defn( $ns, 'plugin_url', function() use ( $ns, $_ns_data ) {
				return plugins_url() . '/' . basename( $_ns_data->plugin_file_path, '.php' );
			} );

		birch_defn( $ns, 'plugin_file_path', function() use ( $ns, $_ns_data ) {
				return $_ns_data->plugin_file_path;
			} );

		birch_defn( $ns, 'plugin_dir_path', function () use ( $ns, $_ns_data ) {
				return plugin_dir_path( $_ns_data->plugin_file_path );
			} );

		birch_defn( $ns, 'load_modules', function() use ( $ns, $_ns_data ) {
				global $birchpress;

				$modules_dir = $ns->plugin_dir_path() . 'modules';
				$_ns_data->module_names = $birchpress->load_modules( $modules_dir );
			} );

		birch_defn( $ns, 'get_module_lookup_config', function() {
				return array(
					'key' => 'module',
					'lookup_table' => array()
				);
			} );

		birch_defmulti( $ns, 'upgrade_module', $ns->get_module_lookup_config, function( $module_a ) {} );

		birch_defn( $ns, 'upgrade', function() use ( $ns, $_ns_data ) {
				foreach ( $_ns_data->module_names as $module_name ) {
					$ns->upgrade_module( array(
							'module' => $module_name
						) );
				}
			} );

		birch_defn( $ns, 'init_packages', function() use ( $ns ) {
				global $birchpress;

				$birchpress->init_package( $ns );
			} );

		birch_defn( $ns, 'run', function() use( $ns ) {
				global $birchpress;

				$ns->load_modules();
				$ns->init_packages();
				$ns->upgrade();
			} );

	} );
