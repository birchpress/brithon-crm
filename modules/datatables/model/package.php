<?php

birch_ns( 'brithoncrm.datatables.model', function( $ns ) {

        global $brithoncrm;

        $ns->init = function() use ( $ns ) {
            add_action( 'init', array( $ns, 'wp_init' ) );
        };

        $ns->wp_init = function() use ( $ns, $brithoncrm ) {
            global $birchpress;

            if ( is_main_site() ) {
                add_action( 'wp_ajax_load_data', array( $ns, 'get_json_data' ) );
            }
        };

        $ns->get_json_data = function() use ( $ns, $brithoncrm ) {
            $filepath = $brithoncrm->plugin_url() . '/modules/datatables/model/data.json';
            $data = '';

            if ( !isset( $_POST['draw'] ) || !isset( $_POST['start'] ) || !isset( $_POST['length'] ) ) {
                die( '{"data": {}}' );
            }

            $draw = $_POST['draw'];
            $start = $_POST['start'];
            $length = $_POST['length'];

            $file = fopen( $filepath, 'r' );
            if ( $file ) {
                while ( !feof( $file ) ) {
                    $data .= fread( $file, 100 );
                }
            } else {
                $data = '{"data": {}}';
            }
            $data_obj = json_decode( $data );
            $data_arr = $data_obj->data;
            $total = count( $data_arr );

            if ( $start < $total ) {
                $result = new stdClass();
                $result->data = array_slice( $data_arr, $start, $length );
                $result->draw = $draw;
                $result->recordsTotal = $total;
                $result->recordsFiltered = $total;
                die( json_encode( $result ) );
            } else {
                die( '{"data": {}}' );
            }
        };

        $ns->return_err_msg = function( $msg, $error = 'Error' ) use ( $ns ) {
            die( json_encode( array(
                        'error' => $error,
                        'message' => $msg,
                    ) ) );
        };

    } );
