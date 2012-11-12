var User     = require('../models/user').User;
var Calendar = require('../models/calendar').Calendar;
var Event    = require('../models/event').Event;

exports.logoutUser        = function(req, res){
	req.logOut();
	res.redirect('/');
};


exports.getAllData        = function (req, res){

	var userID = req.user._id;
	
	// Get the user data with all relevant calendars data
	User.getUserWithCalendarData(userID, function(err, userData){
	
		// Get all the event ids
		var eventIds  = [];

		for (var i = 0; i < userData.userCalendars.length; i++) {
			eventIds = eventIds.concat(userData.userCalendars[i].events);
		}

		for (var j = 0; j < userData.subscriptions.length; j++) {
			eventIds = eventIds.concat(userData.subscriptions[j].events);
		}

		// Get the event's data
		Event.getEventsByIds(eventIds, function(err, allEvents){

			// Handle Error
			if(err){
				console.log(':-( Error finding events by Ids.');
			} else {

				// Handle response to client

				var outputObj = {

					user : userData,
					events : allEvents

				};

				res.send(JSON.stringify(outputObj), 200);

			}

		});

	});
};


exports.getUserCalendars  = function (req, res){

	var userID    = req.user._id;
	
	User.getUserCalendars([userID], function(err, calendardocs){
	
	var outputObj = calendardocs || [];

	res.send(JSON.stringify(outputObj), 200);

	});
};

exports.subscribeCalendar = function (req, res){

	var calendaerId = req.params.calId;
	var userId      = req.user._id;

    Calendar.findById(calendaerId, function(err, doc){

		if(err){
			console.log(":-( Error finding calendar");
		} else {
			User.subscribeCalendar(doc, userId, function(err, userdoc){
				if(err){
					console.log(err);
					// TODO Inform frontend of an error
				}else{
					res.send(JSON.stringify(doc), 200);
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

