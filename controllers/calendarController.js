var helper = require('../helper/dateHelper.js');
var auth = require('../helper/authHelper.js');
var moment = require('moment');
var Calendar = require('../models/calendar').Calendar;
var User = require('../models/user').User;
var CONFIG = require('config');

/*
 * Performs a search
 * URL Pattern: '/search/:term'
 */
exports.searchCalendars = function(req, res) {
        
    var searchterm = req.params.term;

    Calendar.searchCalendars(searchterm, function(err, calendardocs){
        
        console.log("Search term: "+searchterm+" , Results: "+calendardocs.length);

        var outputObj = {

            calendarResults: calendardocs
        };

        res.send(JSON.stringify(outputObj), 200);
    });
};
exports.createCalendar = function(req, res) {
        
    receivedCalendar = JSON.parse(req.body.data);


    // 1. Save the new calendar into the calendars-collection.
    var newCalendar           = new Calendar();
    newCalendar.title         = receivedCalendar.title;
    newCalendar.description   = receivedCalendar.description;
    newCalendar.owner         = req.user._id;

    newCalendar.save(function(err) {
        if (err) {
            console.log(':-( error saving new calendar');
            console.log(err);
        } else {
            console.log(':-) new calendar successfully saved');
            
                // 2. Add the new calendar to the coresponding user document.
                User.findById(req.user._id, function(err, user){

                    user.userCalendars.push(newCalendar);

                    user.save(function(err) {
                    if (err) {
                        console.log(':-( error adding new calendar');
                        console.log(err);
                        res.send({ error: 'something blew up' }, 500); // TODO this doesn't quite work :-(
                    } else {
                        console.log(':-) new event successfully added');

                        res.send(JSON.stringify({data: "success!"}), 200);
                    }
                });

            });
        }
    });

};
