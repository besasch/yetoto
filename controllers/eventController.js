var helper = require('../helper/dateHelper.js');
var auth = require('../helper/authHelper.js');
var moment = require('moment');
var Calendar = require('../models/calendar').Calendar;
var Event = require('../models/event').Event;
var CONFIG = require('config');

/*
 * Retrieves all events for a specific day
 * URL Pattern: '/data/:year/:month/:day'
 */
exports.getDay = function(req, res) {
        
    var year = req.params.year;
    var month = req.params.month;
    var day = req.params.day;

    if(!moment(year + "-" + month + "-" + day, "YYYY-MM-DD").isValid()){

        res.redirect('/');

    } else {

        Event.getAllEventsByDate([year, month, day], function(err, eventdocs){
            
            var outputObj =
            {
                events : eventdocs || []
            };

        res.send(JSON.stringify(outputObj), 200);

        });
    }
};

exports.deleteEvent = function(req, res) {

        var eventId = req.params.eventId;

        Event.findByIdAndRemove(eventId, function(err, eventObj){

            if (err) {
                console.log(':-( error deleting event with Id: ' + eventId);
                console.log(err);
            } else {

                Calendar.findById(eventObj._calendar, function(err, cal){

                    cal.events.remove(eventId);

                    cal.save(function(err) {
                        if (err) {

                            console.log(':-( error saving calendar. Attention: Consistency Problem!');
                            console.log(err);

                        } else {

                            res.send(JSON.stringify(eventObj), 200);

                        }
                    
                    });
                });
            }

        });

};

exports.updateEvent = function(req, res){

    var calendarId = req.params.cal_id;

    var receivedEvent = JSON.parse(req.body.data);

    Event.findById(receivedEvent._id, function(err, eventdoc){
        if(err) {
            console.log(":-( Finding event failed.");
        } else {
            eventdoc.title = receivedEvent.title;
            eventdoc.content = receivedEvent.content;
            eventdoc.startDate = receivedEvent.startDate._d;
            eventdoc.endDate = receivedEvent.endDate._d;
            eventdoc.location = receivedEvent.location;

            eventdoc.save(function(err){
                if(err){
                    console.log(":-( Updating event failed.");
                } else {

                    res.send(JSON.stringify(eventdoc), 200);

                }


            });
        }
    });
};

/**
 * Adds a new event entity to the database
 */
//auth.ensureAuthenticated must be added here!
exports.createEvent = function(req, res) {
    
    var calendarId = req.params.cal_id;

    receivedEvent = JSON.parse(req.body.data);

    //TODO: Implement startdate and enddate
    //var starttime = moment(req.body.startdate + req.body.starttime, "YYYY/MM/DDTHH:mm");
    //var endtime = moment(req.body.enddate + req.body.endtime, "YYYY/MM/DDTHH:mm");

    // 1. Save the new event into the events-collection.
    var newEvent              = new Event();
    newEvent.creationTime     = new Date();
    newEvent.modificationTime = new Date();
    newEvent.title            = receivedEvent.title;
    newEvent.content          = receivedEvent.content;
    newEvent.startDate        = receivedEvent.startDate._d;
    newEvent.endDate          = receivedEvent.endDate._d;
    newEvent.location         = receivedEvent.location;
    newEvent._calendar        = calendarId;
    newEvent.owner            = req.user._id;

    newEvent.save(function(err) {
        if (err) {
            console.log(':-( error saving new event');
            console.log(err);
        } else {
                // 2. Add the new event to the coresponding calendar document.
                Calendar.findById(calendarId, function(err, calendar){

                    calendar.events.push(newEvent);

                    calendar.save(function(err) {
                    if (err) {
                        console.log(':-( error adding new event');
                        console.log(err);
                        res.send({ error: 'something blew up' }, 500); // TODO this doesn't quite work :-(
                    } else {
                        Event.findById(newEvent)
                        .populate('_calendar', 'picture')
                        .exec(function(err, doc){

                            res.send(JSON.stringify(doc), 200);
                        });
                    }
                });

            });
        }
    });

};