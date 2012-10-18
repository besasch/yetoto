var User = require('../models/user').User;
var Calendar = require('../models/calendar').Calendar;

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

exports.subscribeCalendar = function (req, res){
        
    var calendaerId = req.params.calId;
    var userId = req.user._id;

    Calendar.findById(calendaerId, function(err, doc){

		if(err){
			console.log(":-( Error finding calendar");
		} else {
			User.subscribeCalendar(doc, userId, function(err, userdoc){
				if(err){
					console.log(err);
					// TODO Inform frontend of an error
				}else{
					res.send(JSON.stringify({data: "success!"}), 200);
				}
			});
		}

    });
    
};

exports.unsubscribeCalendar = function (req, res){

    var calendaerId = req.params.calId;
    var userId = req.user._id;

    Calendar.findById(calendaerId, function(err, doc){

		if(err){
			console.log(":-( Error finding calendar");
		} else {
			User.unsubscribeCalendar(doc, userId, function(err, userdoc){
				if(err){
					console.log(err);
					// TODO Inform frontend of an error
				}else{
					res.send(JSON.stringify({data: "success!"}), 200);
				}
			});
		}

    });
    
};

