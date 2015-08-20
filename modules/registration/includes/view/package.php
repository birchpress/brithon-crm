<?php

birch_ns( 'brithoncrm.registration', function( $ns ) {

		global $brithoncrm;

		$ns->wp_admin_init = function() use ( $ns, $brithoncrm ) {

		};

		$ns->wp_header = function() use ( $ns ) {
			$ns->register_widgets();
		};

		$ns->register_widgets = function() use ( $ns ) {
			wp_register_sidebar_widget( 'birchpress-register-form', 'User Area', array( $ns, 'render_registration_widget' ),
				array(
					'description' => 'Register a new account',
				) );
		};

		$ns->render_registration_widget = function( $args ) {
			echo $args['before_widget'];
			echo $args['before_title'] . 'Register' .  $args['after_title'];
			if ( !is_user_logged_in() ) {
				echo '<section><a href="wp-login.php">Log in</a></section>';
				echo '<section id="registerapp"></section>';
			}
			echo $args['after_widget'];
		};

} );
