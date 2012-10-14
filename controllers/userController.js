var User = require('../models/user').User; // mongoose modal verfügbar machen

exports.logoutUser = function(req, res){
	req.logOut();
	res.redirect('/');
};

exports.getUserCalendars = function (req, res){
        
    var userID = req.user._id;

    console.log('userID: '+userID);

        User.getUserCalendars([userID], function(err, calendardocs){
            
            var outputObj = calendardocs || [];

        res.send(JSON.stringify(outputObj), 200);

        });
    
};

