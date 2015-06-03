<?php

birch_ns( 'brithoncrm', function( $ns ) {

		$plugin_url = '';

		$plugin_file_path = '';

		$module_names = array();

		$product_version = '';

		$product_name = '';

		$product_code = '';

		birch_defn( $ns, 'set_product_version', function( $_product_version ) use ( $ns, &$product_version ) {
				$product_version = $_product_version;
			} );

		birch_defn( $ns, 'get_product_version', function() use ( $ns, &$product_version ) {
				return $product_version;
			} );

		birch_defn( $ns, 'set_product_name', function( $_product_name ) use ( $ns, &$product_name ) {
				$product_name = $_product_name;
			} );

		birch_defn( $ns, 'get_product_name', function() use ( $ns, &$product_name ) {
				return $product_name;
			} );

		birch_defn( $ns, 'set_product_code', function( $_product_code ) use ( $ns, &$product_code ) {
				$product_code = $_product_code;
			} );

		birch_defn( $ns, 'get_product_code', function() use ( $ns, &$product_code ) {
				return $product_code;
			} );

		birch_defn( $ns, 'set_plugin_file_path', function ( $_plugin_file_path )
			use( $ns, &$plugin_url, &$plugin_file_path ) {

				$plugin_file_path = $_plugin_file_path;
				$plugin_url = plugins_url() . '/' . basename( $plugin_file_path, '.php' );
			} );

		birch_defn( $ns, 'plugin_url', function() use ( $ns, &$plugin_url ) {
				return $plugin_url;
			} );

		birch_defn( $ns, 'plugin_file_path', function() use ( $ns, &$plugin_file_path ) {
				return $plugin_file_path;
			} );

		birch_defn( $ns, 'plugin_dir_path', function () use ( $ns, &$plugin_file_path ) {
				return plugin_dir_path( $plugin_file_path );
			} );

		birch_defn( $ns, 'get_dev_modules', function() use ( $ns ) {
				@include_once $ns->plugin_dir_path() . 'dev.local.php';
				if ( empty( $dev_local ) ) {
					return false;
				}
				$build_dev_file_path = $ns->plugin_dir_path() . 'buildfiles/dev.json';
				$build_config = json_decode( file_get_contents( $build_dev_file_path ), true );
				$edition_config = $build_config['editions'][$dev_local['edition']];
				if ( empty( $edition_config ) ) {
					return false;
				}
				$module_names = $edition_config['addons'];
				return $module_names;
			} );

		birch_defn( $ns, 'load_modules', function() use ( $ns, &$module_names ) {
				global $birchpress;

				$modules_dir = $ns->plugin_dir_path() . 'modules';
				$dev_modules = $ns->get_dev_modules();
				$module_names = $birchpress->load_modules( $modules_dir, $dev_modules );
			} );

		birch_defn( $ns, 'get_module_lookup_config', function() {
				return array(
					'key' => 'module',
					'lookup_table' => array()
				);
			} );

		birch_defmulti( $ns, 'upgrade_module', $ns->get_module_lookup_config, function( $module_a ) {} );

		birch_defn( $ns, 'upgrade', function() use ( $ns, &$module_names ) {
				foreach ( $module_names as $module_name ) {
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

		birch_defn( $ns, 'spawn_cron', function() {
				spawn_cron();
			} );

	} );
