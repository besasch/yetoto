helper = require('../helper/dateHelper.js');
auth = require('../helper/authHelper.js');

var moment = require('moment');

// Requiring the model
var Calendar = require('../models/calendar').Calendar;
var Event = require('../models/event').Event;
// getting the Config
var CONFIG = require('config');


    // Events:
//    app.get('/events/:id', auth.ensureAuthenticated, function(req, res) {
exports.showEvent = function(req, res) {
        Calendar.find({}, function(err, docs){

            Event.findById(req.params.id)
            .populate('owner')
            .exec(function(err, doc){

                res.render('event.ejs', {
                    calendars: docs || [] ,
                    event : doc,
                    created : helper.formatDate(doc.creationTime),
                    modified : helper.formatDate(doc.modificationTime),
                    title : 'Event Details',
                    user: req.user
                });
            });
        });
    };

//app.get('/data/events/:id', auth.ensureAuthenticated, function(req, res) {
exports.getEvent = function(req, res) {
            
        Event.findById(req.params.id)
        .populate('owner')
        .exec(function(err, doc){

            var outputObj = {
                "eventItem" : doc
            };
            
            res.send({meta: 200, data: outputObj}, 200);
        });
        
    };


//app.get('calendars/:cal_id/events/:event_id', auth.ensureAuthenticated, function(req, res) {
exports.showEventInCalender = function(req, res) {            
        res.redirect('/events/' + req.params.event_id);

    };

//auth.ensureAuthenticated must be added here!
exports.createEvent = function(req, res) {
            
        var calendarId = req.params.cal_id;

        var starttime = moment(req.body.startdate + req.body.starttime, "YYYY/MM/DDTHH:mm");
        var endtime = moment(req.body.enddate + req.body.endtime, "YYYY/MM/DDTHH:mm");

        // 1. Save the new event into the events-collection.
        var newEvent = new Event();
        newEvent.creationTime = new Date();
        newEvent.modificationTime = new Date();
        newEvent.title = req.body.title;
        newEvent.body = req.body.body;
        newEvent.startTime = starttime;
        newEvent.endTime = endtime;
        newEvent.location = req.body.location;
        newEvent._calendar = calendarId;
        newEvent.owner = req.user._id;

        newEvent.save(function(err) {
            if (err) {
                console.log(':-( error saving new event');
                console.log(err);
            } else {
                console.log(':-) new event successfully saved');
                
                    // 2. Add the new event to the coresponding calendar document.
                    Calendar.findById(calendarId, function(err, calendar){

                        calendar.events.push(newEvent);

                        calendar.save(function(err) {
                        if (err) {
                            console.log(':-( error adding new event');
                            console.log(err);
                        } else {
                            console.log(':-) new event successfully added');

                            res.redirect('/calendars/' + calendarId);
                        }
                    });

                });
            }
        });
    };

    
//    app.put('/events/:id', auth.ensureAuthenticated, function(req, res) {
exports.updateEvent = function(req, res) {
            
        //TODO Implement event update

    };


//app.delete('/calendars/:cal_id/events/:event_id', auth.ensureAuthenticated, function(req, res) {
exports.deleteEvent = function(req, res) {
    
        var calendarId = req.params.cal_id;
        var eventId = req.params.event_id;

        Event.findById(eventId, function(err, eve){

            eve.remove(function(err) {
                if (err) {
                    console.log(':-( error deleting event ' + eve.title);
                    console.log(err);
                } else {

                    console.log(':-) event ' + eve.title +' successfully deleted from events-collection');

                    Calendar.findById(calendarId, function(err, cal){

                        cal.events.remove(eventId);
                        cal.save(function(err) {
                            if (err) {
                                console.log(':-( error deleting event ' + eve.title + ' from calendar' + cal.title);
                                console.log(err);
                            } else {
                                console.log(':-) event ' + eve.title +' successfully deleted from calendar ' + cal.title);
                                res.redirect('/calendars/' + calendarId);
                            }
                        
                        });
                    });
                }
             });
        });
    };
