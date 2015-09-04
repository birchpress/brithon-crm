<?php

birch_ns( 'brithoncrm.subscriptions.view.i18n', function( $ns ) {

        global $brithoncrm;

        $ns->init = function() use ( $ns ) {

        };

        $ns->get_i18n_strings = function() use ( $ns ) {
            $str = array(
                'Billing_and_invoices' => __('Billing and invoices', 'brithoncrm-subscriptions'),

                'User_does_not_exist.' => __('User does not exist.', 'brithoncrm-subscriptions'),

                'No_credit_card' => __('No credit card.', 'brithoncrm-subscriptions'),

                'No_customer_info' => __('No customer info.', 'brithoncrm-subscriptions'),

                'Change_or_update_your_credit_card' => __('Change or update your credit card', 'brithoncrm-subscriptions'),

                'Changes_to_your_credit_card_will_be_effective_immediately.' => __('Changes to your credit card will be effective immediately.', 'brithoncrm-subscriptions'),

                'All_future_charges_will_be_charged_to_this_card.' => __('All future charges will be charged to this card.', 'brithoncrm-subscriptions'),

                'Thanks_for_updating_your_billing_information.' => __('Thanks for updating your billing information.', 'brithoncrm-subscriptions'),

                'Hide' => __('Hide', 'brithoncrm-subscriptions'),

                'Change_your_credit_card_and_billing_information' => __('Change your credit card and billing information', 'brithoncrm-subscriptions'),

                'See_plans_and_upgrade_or_downgrade' => __('See plans and upgrade or downgrade', 'brithoncrm-subscriptions'),

                'Choose_plan' => __('Choose plan', 'brithoncrm-subscriptions'),

                'Your_next_charge_is_$%s_on_%s' => __('Your next charge is $%s on %s', 'brithoncrm-subscriptions'),

                'Purchase_completed' => __('Purchase completed.', 'brithoncrm-subscriptions'),

                'You_are_currently_on_a_trial_subscription.' => __('You are currently on a trial subscription.', 'brithoncrm-subscriptions'),

                'Buy_subscription' => __('Buy subscription', 'brithoncrm-subscriptions'),

                'Trial' => __('Trial', 'brithoncrm-subscriptions'),

                'Purchase' => __('Purchase', 'brithoncrm-subscriptions'),

                'Update_My_Card' => __('Update My Card', 'brithoncrm-subscriptions'),

                'Your_credit_card_on_file_is' => __('Your credit card on file is', 'brithoncrm-subscriptions'),

                '$%s_/_month_-_%s_Service_Providers' => __('$%s / month - %s Service providers', 'brithoncrm-subscriptions'),

                'Current_plan:' => __('Current plan:', 'brithoncrm-subscriptions'),

                'Credit_card' => __('Credit card', 'brithoncrm-subscriptions'),

                'Update_Complete_-_Plan' => __('Update Complete - Plan', 'brithoncrm-subscriptions'),

                'Purchase_failed' => __('Purchase failed - ', 'brithoncrm-subscriptions'),

                'Update' => __('Update', 'brithoncrm-subscriptions')
            );
            return $str;
        };
    } );
