helper = require('../helper/dateHelper.js');
auth = require('../helper/authHelper.js');

// Requiring the model
var User = require('../models/user').User;
// getting the Config
var CONFIG = require('config');

module.exports = function(app){

    app.get('/', function(req, res){

        if (req.isAuthenticated()) {
            res.redirect('/today');
        }
        else
        {
            res.render('index.ejs', {
                layout:'public-layout',
                title: 'Welcome',
                user: req.user
            });
        }
    });
};

