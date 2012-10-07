helper = require('../helper/dateHelper.js');

// Requiring the model
var Calendar = require('../models/calendar').Calendar;
var Event = require('../models/event').Event;
// getting the Config
var CONFIG = require('config');
var format = require('util').format;
var auth = require('../helper/authHelper.js');

exports.showNewCalendar = function(req, res){

        //get all the data
        Calendar.find({}, function(err, docs){

            //render the index page
            res.render('newcal.ejs', {
                calendars: docs || [] ,
                title: 'Calendar',
                siteUrl: CONFIG.server.siteUrl,
                user: req.user
            });
        });
    };


    // Calendars:
exports.showCalendar = function(req, res) {
    
        Calendar.find({}, function(err, docs){

            Calendar.getCalendarData(req.params.id, function(err, doc){

                res.render('calendar.ejs', {
                    calendars: docs || [],
                    calendar : doc,
                    created : helper.formatDate(doc.creationTime),
                    modified : helper.formatDate(doc.modificationTime),
                    title : 'Calendar Details',
                    siteUrl: CONFIG.server.siteUrl,
                    user: req.user
                });
            });
        });
        
    };




exports.createCalendar = function(req, res) {
            
        var newCalendar = new Calendar();
        
        newCalendar.creationTime = new Date(),
        newCalendar.modificationTime = new Date(),
        newCalendar.title = req.body.title;
        newCalendar.description = 'Will be added later on. Yeaha... :-P ';
        newCalendar.owner = req.user._id;
        if (req.files.image.name !== ''){
            var fullImagePath = req.files.image.path;
            newCalendar.picture = format('%s%s', CONFIG.images.dir , fullImagePath.replace(/^.*(\\|\/|\:)/, ''));
        }

        newCalendar.save(function(err) {
            if (err) {
                console.log('error adding new calendar');
                console.log(err);
            } else {
                console.log('new calendar successfully saved');
            }
        });
        
        res.redirect('/');
    };


exports.updateCalendar = function(req, res) {
            
        //TODO Implement calendar update

    };


exports.deleteCalendar = function(req, res) {    
        Calendar.findById(req.params.id, function(err, doc){

            var calEvents = doc.events;

            doc.remove(function(err) {
                if (err) {
                    console.log('error deleting calendar ' + doc.title);
                    console.log(err);
                } else {

                    console.log('calendar ' + doc.title +' successfully deleted');

                    for (var i = calEvents.length - 1; i >= 0; i--) {
                    
                        Event.findById(calEvents[i], function(err, eve){

                            eve.remove(function(err) {
                                if (err) {
                                    console.log('error deleting event ' + eve.title);
                                    console.log(err);
                                } else {
                                    console.log('event ' + eve.title +' successfully deleted from events-collection');
                                }
                            });
                        });
                    }
                    res.redirect('/');
                }
            });
        });
    };
