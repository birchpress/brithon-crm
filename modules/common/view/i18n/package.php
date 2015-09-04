<?php

birch_ns( 'brithoncrm.common.view.i18n', function( $ns ) {

        global $brithoncrm;

        $ns->init = function() use ( $ns ) {
            add_action( 'init', array( $ns, 'wp_init' ) );
            add_action( 'admin_init', array( $ns, 'wp_admin_init' ) );
            add_action( 'plugins_loaded', array( $ns, 'load_i18n' ) );
        };

        $ns->wp_init = function() use ( $ns, $brithoncrm ) {
            global $birchpress;

            if ( is_main_site() ) {

            }
        };

        $ns->load_i18n = function() use ( $ns, $brithoncrm ) {
            $lang_dir = 'brithon-crm/modules/common/languages';
            $res = load_plugin_textdomain('brithoncrm', false, $lang_dir);
        };

        $ns->get_po_file = function() use ( $ns, $brithoncrm ) {
            $path = $brithoncrm->plugin_url() . '/modules/common/languages/';
            $text_domain = 'brithoncrm';
            $locale = get_locale();
            $file = fopen( $path . $text_domain . '-' . $locale . '.po', 'r');
            $content = '';
            if (!$file){
                return '';
            }
            while( !feof($file) ) {
                $content .= fread($file, 100);
            }
            return $content;
        };

        $ns->wp_admin_init = function() use ( $ns, $brithoncrm ) {

        };

} );
