var ns = birchpress.provide('brithoncrm.subscriptions.stores', {

    init: function() {
        birchpress.addAction('brithoncrm.subscriptions.actions.submitAfter', 
            function(first_name, last_name, email, org, password) {
                first_name = first_name.trim();
                last_name = last_name.trim();
                email = email.trim();
                org = org.trim();
                password = password.trim();
                if(first_name != '' && last_name != '' && email != '' && org != '' && password != '') {
                    var usrname = email;
                    ns.submit(usrname, password, email, first_name, last_name, org);
                }
            }
        );
    },

    submit: function(username, password, email, first_name, last_name, organization) {
        ns.postApi(
            'wp-admin/admin-post.php', 
            {
                'action': 'register_birchpress_account',
                'username': username,
                'password': password,
                'email': email,
                'first_name': first_name,
                'last_name': last_name,
                'org': organization
            },
            function(err, r) {
                if(err){
                    alert(err);
                } else {
                    location.assign('/wp-admin');
                }
            }
        );
    },

    generateUserName: function(first_name, last_name) {
        return first_name + '_' + last_name + Math.random().toString();
    },

    _ajax: function(method, url, data, callback) {
        jQuery.ajax({
            type: method,
            url: url,
            data: data,
            dataType: 'json'
        }).done(function(r) {
            if (r && r.error) {
                return callback && callback(r);
            }
            return callback && callback(null, r);
        }).fail(function(jqXHR, textStatus) {
            return callback && callback({error: 'HTTP ' + jqXHR.status, message: 'Network error (HTTP ' + jqXHR.status + ')'});
        });
    },

    getApi: function (url, data, callback) {
        if (arguments.length === 2) {
            callback = data;
            data = {};
        }
        ns._ajax('GET', url, data, callback);
    },

    postApi: function(url, data, callback) {
        if (arguments.length === 2) {
            callback = data;
            data = {};
        }
        ns._ajax('POST', url, data, callback);
    }   
});

module.exports = ns;