<?php

birch_ns( 'brithoncrm.test', function( $ns ) {

		global $brithoncrm;

		$ns->init = function() use ( $ns ) {
			add_action( 'init', array( $ns, 'wp_init' ) );
			add_action( 'admin_init', array( $ns, 'wp_admin_init' ) );
			add_action( 'admin_menu', array( $ns, 'create_admin_menus' ) );
		};

		$ns->wp_init = function() use ( $ns ) {

		};

		$ns->wp_admin_init = function() use ( $ns, $brithoncrm ) {
			add_action( 'admin_enqueue_scripts', function( $hook ) use ( $ns, $brithoncrm ) {
					global $birchpress;

					$birchpress->view->register_3rd_scripts();
					$birchpress->view->register_core_scripts();
					if ( strpos( $hook, 'birthoncrm/test' ) > 0 ) {
						wp_enqueue_style( 'brithoncrm_test_base',
							$brithoncrm->plugin_url() . '/modules/test/assets/css/base.css' );
						wp_enqueue_style( 'brithoncrm_test_app',
							$brithoncrm->plugin_url() . '/modules/test/assets/css/app.css' );
						wp_register_script( 'brithoncrm_test_index',
							$brithoncrm->plugin_url() . '/modules/test/assets/js/index.bundle.js',
							array( 'birchpress', 'react-with-addons', 'immutable' ) );
						wp_enqueue_script( 'brithoncrm_test_index');
					}
				} );
		};

		$ns->create_admin_menus = function() use ( $ns, $brithoncrm ) {
			add_menu_page( 'Todo Test', 'Todo Test', 'manage_options',
				'birthoncrm/test', array( $ns, 'render_admin_page' ), '', 86 );
		};

		$ns->render_admin_page = function() use ( $ns, $brithoncrm ) {
?>
			<section id="todoapp"></section>
			<footer id="info">
			    <p>Double-click to edit a todo</p>

				<p>Created by Brithon</p>
			    <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
			</footer>
<?php
		};
	} );
