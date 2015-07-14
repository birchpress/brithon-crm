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

if ( defined( 'ABSPATH' ) && ! defined( 'BRITHON_CRM' ) ) {

	define( 'BRITHON_CRM', true );

	if ( is_file( dirname( __DIR__ ) . '/birchpress/birchpress.php' ) ) {
		require_once dirname( __DIR__ ) . '/birchpress/birchpress.php';
		birchpress_load_common_framework();
	} else {
		require_once 'framework/includes/birchpress.inc.php';
		global $birchpress;
		$birchpress->set_framework_url( plugins_url() . '/' . basename( __FILE__, '.php' ) . '/framework' );
	}

	require_once 'package.php';

	global $brithoncrm;

	$brithoncrm->set_plugin_file_path( __FILE__ );
	$brithoncrm->set_product_version( '<%= productVersion %>' );
	$brithoncrm->set_product_name( '<%= productName %>' );
	$brithoncrm->set_product_code( '<%= productCode %>' );

	$brithoncrm->run();

}
