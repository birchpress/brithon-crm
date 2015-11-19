<?php

birch_ns( 'brithoncrm.common.view.i18n', function( $ns ) {

		global $brithoncrm;

		$ns->init = function() use ( $ns ) {
			add_action( 'plugins_loaded', array( $ns, 'load_i18n' ) );
		};

		$ns->get_lang_path = function( $subdir = '/languages' ) use ( $ns ) {
			$basename = plugin_basename( __FILE__ );
			$arr = explode( '/', $basename );
			$path = $arr[0] . $subdir;
			return $path;
		};

		$ns->load_i18n = function() use ( $ns, $brithoncrm ) {
			$lang_dir = $ns->get_lang_path();
			load_plugin_textdomain( 'brithoncrm', false, $lang_dir );
		};

		$ns->get_translations = function() use ( $ns, $brithoncrm ) {
			return get_translations_for_domain( 'brithoncrm' );
		};
} );
