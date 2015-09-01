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
            $data = '';

            if ( !isset( $_POST['draw'] ) || !isset( $_POST['start'] ) || !isset( $_POST['length'] ) ) {
                die( '{"data": {}}' );
            }

            $draw = $_POST['draw'];
            $start = $_POST['start'];
            $length = $_POST['length'];

            $data = $ns->fetch_json_data();

            $data_obj = json_decode( $data );
            $data_arr = $data_obj->data;
            $total = count( $data_arr );

            if ( $start < $total ) {
                $result = new stdClass();
                $part = array_slice( $data_arr, $start, $length );

                foreach ( $_POST['order'] as $order ) {
                    $asc = ( $order['dir'] === 'asc' )?true:false;
                    $comparator = function() use ( $ns, $order, $asc ) {
                        $applied_args = func_get_args();
                        $info = array(
                            'id' => $order['column'],
                            'asc' => $asc
                        );
                        return call_user_func_array( array( $ns, 'column_comparater' ), array_merge( $applied_args, $info, func_get_args() ) );
                    };
                    usort( $part, $comparator );
                }

                $result->data = $part;
                $result->draw = $draw;
                $result->recordsTotal = $total;
                $result->recordsFiltered = $total;
                die( json_encode( $result ) );
            } else {
                die( '{"data": {}}' );
            }
        };

        $ns->fetch_json_data = function() use ( $ns, $brithoncrm ) {
            static $content = '';

            if ( !$content ) {
                $filepath = $brithoncrm->plugin_url() . '/modules/datatables/model/data.json';
                $file = fopen( $filepath, 'r' );
                if ( $file ) {
                    while ( !feof( $file ) ) {
                        $content .= fread( $file, 100 );
                    }
                } else {
                    $content = '{"data": {}}';
                }
            }
            return $content;
        };

        $ns->column_comparater = function( $element1, $element2, $id, $asc = true ) use ( $ns ) {
            if ( $asc ) {
                return strcmp( $element1[$id], $element2[$id] );
            } else {
                return strcmp( $element2[$id], $element1[$id] );
            }
        };

        $ns->return_err_msg = function( $msg, $error = 'Error' ) use ( $ns ) {
            die( json_encode( array(
                        'error' => $error,
                        'message' => $msg,
                    ) ) );
        };

    } );
