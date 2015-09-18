<?php

class SampleTest extends WP_UnitTestCase {
	function test_get_max_provider() {
		global $brithoncrm;
		$returnId = $brithoncrm->subscriptions->model->get_max_providers( 1 );
		$this->assertEquals( 1, $returnId );
		$returnId = $brithoncrm->subscriptions->model->get_max_providers( 2 );
		$this -> assertEquals( 5, $returnId );
		$returnId = $brithoncrm->subscriptions->model->get_max_providers( 3 );
		$this -> assertEquals( 10, $returnId );
		$returnId = $brithoncrm->subscriptions->model->get_max_providers( 4 );
		$this -> assertEquals( 20, $returnId );
		$returnId = $brithoncrm->subscriptions->model->get_max_providers( 5 );
		$this -> assertEquals( 0, $returnId );
	}
	function test_return_result() {
		global $brithoncrm;
		$succeed = 'hello';
		$data = 'bye';
		$result = $brithoncrm->subscriptions->model->return_result( $succeed , $data );
		$this->assertEquals( array( 'succeed' => 'hello' , 'data' => 'bye' ), $result );
	}
	function test_get_all_plans() {
		global $brithoncrm;
		$return_result = $brithoncrm->subscriptions->model->get_all_plans();
		$return_result = $return_result[ 'data' ];
		foreach ( $return_result as $item ) {
			echo $item[ 'id' ];
			echo ' ';
		}
	}
}
