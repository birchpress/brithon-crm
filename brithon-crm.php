<?php

/*
  Plugin Name: <%= productName %>
  Plugin URI: http://www.brithon.com
  Description: CRM for brithon.com
  Version: <%= productVersion %>
  Author: Brithon Inc.
  Author URI: http://www.brithon.com
  License: GPLv2
 */

if ( defined( 'ABSPATH' ) && ! function_exists( 'brithoncrm_main' ) ) {

	function brithoncrm_main() {

		require_once 'lib/vendor/autoload.php';
		require_once 'loader.php';
        include 'includes/ChromePhp.php';

		brithoncrm_load( array(
				'plugin_file_path' => __FILE__,
				'product_version' => '<%= productVersion %>',
				'product_name' => '<%= productName %>',
				'product_code' => '<%= productCode %>',
				'global_name' => 'brithoncrm'
			) );
	}

	brithoncrm_main();
}