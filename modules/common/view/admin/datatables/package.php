<?php

birch_ns( 'brithoncrm.common.view.admin.datatables', function( $ns ) {

		global $brithoncrm;

		$ns->init = function() use ( $ns ) {
			add_action( 'init', array( $ns, 'wp_init' ) );
			add_action( 'admin_init', array( $ns, 'wp_admin_init' ) );
			add_action( 'admin_menu', array( $ns, 'create_admin_menus' ) );
		};

		$ns->wp_init = function() use ( $ns, $brithoncrm ) {
			global $birchpress;

			$params = array(
				'ajax_url' => admin_url( 'admin-ajax.php' ),
			);

			if ( is_main_site() ) {
				$birchpress->view->register_3rd_scripts();
				$birchpress->view->register_3rd_styles();
				$birchpress->view->register_core_scripts();
				wp_enqueue_style( 'brithoncrm_datatables_style', 'http://cdn.datatables.net/1.10.8/css/jquery.dataTables.css' );

				wp_register_script( 'brithoncrm_common_apps_admin_datatables',
					$brithoncrm->plugin_url() . '/modules/common/assets/js/apps/admin/datatables/index.bundle.js',
					array( 'birchpress', 'react-with-addons', 'immutable', 'jquery.datatables' ) );

				wp_localize_script( 'brithoncrm_common_apps_admin_datatables', 'brithoncrm_common_apps_admin_datatables', $params );

				wp_enqueue_script( 'brithoncrm_common_apps_admin_datatables' );
			}
		};

		$ns->wp_admin_init = function() use ( $ns, $brithoncrm ) {

		};

		$ns->create_admin_menus = function() use ( $ns ) {
			add_menu_page( 'Datatable Demo', 'DataTable', 'read',
				'brithoncrm/datatables', array( $ns, 'render_setting_page' ), '', 82 );
		};
		$ns->render_setting_page = function() use ( $ns ) {
?>
			<section id="datatabledemo"></section>
<?php
		};

	} );
