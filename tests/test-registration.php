<?php
class Registration_Test extends WP_UnitTestCase{
	public function setUp() {
		$_POST['username'] = 'test_username';
		$_POST['password'] = 'test_password';
		$_POST['email'] = 'test_email@test.com';
		$_POST['first_name'] = 'testFirstName';
		$_POST['last_name'] = 'testLastName';
		$_POST['org'] = 'testOrg';
	}

	function test_register_account() {
		global $brithoncrm;
		$result = $brithoncrm->registration->model->register_account();
		$result = user_pass_ok( 'test_username' , 'test_password' );
		$this -> assertTrue( $result );
	}
}
