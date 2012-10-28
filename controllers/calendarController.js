var helper = require('../helper/dateHelper.js');
var auth = require('../helper/authHelper.js');
var moment = require('moment');
var User = require('../models/user').User;
var Calendar = require('../models/calendar').Calendar;
var Event = require('../models/event').Event;
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

                        res.send(JSON.stringify(newCalendar), 200);
                    }
                });

            });
        }
    });

};
exports.deleteCalendar = function(req, res) {
        
    var calendarId = req.params.calId;
    var userId  = req.params.userId;
    CalendarToBeDeleted = new Calendar();
    CalendarToBeDeleted._id = calendarId;


    // A. Delete Calendar from Database
    Calendar.remove({ _id: calendarId }, function(err) {
        if (err) {
            console.log('could not remove calendar from calendars collection');
        }
        else {
            console.log('calendar deleted');
        }
    });
    
    // B. Delete Calendar from User
        // 1. Find Users who are owners of the calendar
    User.find( { 'userCalendars' : CalendarToBeDeleted }, function(err, result) {
        if (err) {
            console.log("Seems that nobody was owner of the calendar... Error: " + err);
        }
        else {
        // 2. Delete Ownerships
            var i = result.length;

            while(i--){
                result[i].userCalendars.pull(CalendarToBeDeleted);
                result[i].save();
            }
            console.log("Ownership of calendar have been removed.");
            
        }
    });
 
    // C. Delete Calendar Subscriptions 
        // 1. Find Users who subscribed to the calendar
    User.find( { 'subscriptions' : CalendarToBeDeleted }, function(err, result) {
        if (err) {
            console.log("Couldn't delete subscriptions of calendar... Error: " + err);
        }
        else {
        // 2. Delete Subscriptions
            var i = result.length;

            while(i--){
                result[i].subscriptions.pull(CalendarToBeDeleted);
                result[i].save();
            }
            console.log("Subscriptions to calendar have been removed.");
            
        }
    });
 

    // D. Delete events from Calendar
    Event.find( { '_calendar' : CalendarToBeDeleted }, function(err, result) {
        if (err) {
            console.log("Couldn't delete events from calendar... Error: " + err);
        }
        else {
            // Delete Events
            // Save deleted events in an output object so they can be sent back to the client
            // and removed from its Front-End
           var outputObj = {
                events: result
            };

            var i = result.length;

            while(i--){
                result[i].remove();
            }
              
            console.log("Events from calendar have been removed.");

            res.send(JSON.stringify(outputObj), 200);
        }
    });
    

    

};
