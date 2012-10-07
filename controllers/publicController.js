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
        
        console.log("Auth!");

        res.render('yetoto.html', {
            layout: false,
            user: req.user
        });

        
    
    // Else go to login page
    } else {

        console.log("Not!");

        res.render('index.ejs', {
            layout:'public-layout',
            title: 'Welcome',
            user: req.user
        });


    }
};