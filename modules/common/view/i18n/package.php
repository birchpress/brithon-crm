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

		$ns->get_po_file = function() use ( $ns, $brithoncrm ) {
			$path = $brithoncrm->plugin_url() . '/languages';
			$text_domain = 'brithoncrm';
			$locale = get_locale();
			$filename = "$path/$text_domain-$locale.po";

			$response = wp_remote_get( $filename );
			$content = '';
			if ( is_array( $response ) ) {
				$content = $response['body'];
			} else {
				$content = $user_id->get_error_message( $user_id->get_error_code() );
			}

			return $content;
		};
} );
