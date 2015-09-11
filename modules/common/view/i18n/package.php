<?php

birch_ns( 'brithoncrm.common.view.i18n', function( $ns ) {

		global $brithoncrm;

		$ns->init = function() use ( $ns ) {
			add_action( 'plugins_loaded', array( $ns, 'load_i18n' ) );
		};

		$ns->load_i18n = function() use ( $ns, $brithoncrm ) {
			$lang_dir = 'brithon-crm/languages';
			$res = load_plugin_textdomain( 'brithoncrm', false, $lang_dir );
		};

		$ns->get_translations = function() use ( $ns, $brithoncrm ) {
			return get_translations_for_domain( 'brithoncrm' );
		};
} );
