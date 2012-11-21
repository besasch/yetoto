helper = require('../helper/dateHelper.js');
auth = require('../helper/authHelper.js');
var User = require('../models/user').User;
var CONFIG = require('config');


/*
 * Responds the yetoto app if user is authenticated
 * Sends him back to Login if not
 */
exports.goToApp = function(req, res){

    // If authenticated render app
    if (req.isAuthenticated()) {

        res.render('yetoto', {
            user: req.user
        });
    
    // Else go to login page
    } else {
        res.render('index', {
            title: 'Welcome',
            user: req.User
        });
    }
};

// ONLY FOR DEVELOPMENT
exports.goToAppDEV = function(req, res){

        res.render('test.html', {
            layout: false
        });
    
};