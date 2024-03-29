var helper = require('../helper/dateHelper.js');
var auth = require('../helper/authHelper.js');
var imgHelp = require('../helper/imageHelper.js');
var moment = require('moment');
var User = require('../models/user').User;
var Calendar = require('../models/calendar').Calendar;
var Event = require('../models/event').Event;
var CONFIG = require('config');
var fs = require("fs");

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

exports.updateCalendar = function(req, res){

    var receivedCalendar = JSON.parse(req.body.data);

    var image = req.body.image;
    var type = req.body.type;

    Calendar.findById(receivedCalendar._id, function(err, calendar){
        calendar.title = receivedCalendar.title;
        calendar.description = receivedCalendar.description;
        calendar.modificationTime = new Date();

        if(imgHelp.isImageUpload(image)){
            imgHelp.uploadBase64ToS3(image, type, calendar._id + "." + type, function(imageUrl){
                calendar.picture = imageUrl;
                calendar.save(function(err){
                    if (err) {
                        console.log(':-( Error updating new calendar' + err);
                    } else {
                        res.send(JSON.stringify(calendar), 200);
                    }

                });
            });
        } else {
            calendar.save(function(err){
                if (err) {
                    console.log(':-( Error updating new calendar' + err);
                } else {
                    res.send(JSON.stringify(calendar), 200);
                }

            });
        }
    });

};

exports.createCalendar = function(req, res) {

    var receivedCalendar = JSON.parse(req.body.data);

    var image = req.body.image;
    var type = req.body.type;

    // 1. Save the new calendar into the calendars-collection.
    var newCalendar           = new Calendar();
    newCalendar.title         = receivedCalendar.title;
    newCalendar.description   = receivedCalendar.description;
    newCalendar.owner         = req.user._id;

    //Check whether image has been uploaded or default
    if(image.indexOf(CONFIG.defaults.calendarPicture) == -1){
        newCalendar.picture = "/uploads/" + newCalendar._id + "." + type;
    }

    if(imgHelp.isImageUpload(image)){
        imgHelp.uploadBase64ToS3(image, type, newCalendar._id + "." + type, function(imageUrl){ // s3 upload
            newCalendar.picture = imageUrl;
            newCalendar.save(function(err) {
                if (err) {
                    console.log(':-( error saving new calendar');
                    console.log(err);
                } else {
                        User.findById(req.user._id, function(err, user){

                            user.userCalendars.push(newCalendar);

                            user.save(function(err) {
                            if (err) {
                                console.log(':-( error adding new calendar');
                                console.log(err);
                                res.send({ error: 'something blew up' }, 500); // TODO this doesn't quite work :-(
                            } else {
                                res.send(JSON.stringify(newCalendar), 200);
                            }
                        });

                    });
                }
            });
        });
    }
};

exports.deleteCalendar = function(req, res) {

    var userId  = req.params.userId;
    var CalendarToBeDeleted = new Calendar();
    CalendarToBeDeleted._id = req.params.calId;


    // A. Delete Calendar from Database
    Calendar.findById({ _id: CalendarToBeDeleted._id }, function(err, result) {
        if (err) {
            console.log('could not remove calendar from calendars collection');
        }
        else {
            CalendarToBeDeleted = result;

            // B. Delete Calendar Picture
            if(CalendarToBeDeleted.picture != CONFIG.defaults.calendarPicture){
                imgHelp.deleteImgFromS3(CalendarToBeDeleted.picture, function(err){
                    if(err){console.log(':-( Got an error deleting from S3: '+ err);}
                });
            }
            CalendarToBeDeleted.remove();
        }
    });

    // C. Delete Calendar from User
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

    // D. Delete Calendar Subscriptions
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

    // E. Delete events from Calendar
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
