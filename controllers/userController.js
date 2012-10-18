var User = require('../models/user').User;

exports.logoutUser = function(req, res){
	req.logOut();
	res.redirect('/');
};

exports.getUserCalendars = function (req, res){
        
    var userID = req.user._id;

    User.getUserCalendars([userID], function(err, calendardocs){
        
        var outputObj = calendardocs || [];

		res.send(JSON.stringify(outputObj), 200);

    });
    
};

