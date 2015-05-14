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

if ( defined( 'ABSPATH' ) && !defined( 'BRITHON_CRM' ) ) {

	define( 'BRITHON_CRM', true );

	require_once 'framework/includes/birchpress.inc.php';

	require_once 'package.php';

	global $brithoncrm, $birchpress;

	$brithoncrm->set_plugin_file_path( __FILE__ );
	$birchpress->set_plugin_url( $brithoncrm->plugin_url() );

	$brithoncrm->set_product_version( '<%= productVersion %>' );
	$brithoncrm->set_product_name( '<%= productName %>' );
	$brithoncrm->set_product_code( '<%= productCode %>' );

	$brithoncrm->run();

}
