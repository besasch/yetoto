helper = require('../helper/dateHelper.js');

var moment = require('moment');

var auth = require('../helper/authHelper.js');

// Requiring the model
var Calendar = require('../models/calendar').Calendar;
var Event = require('../models/event').Event;

// getting the Config
var CONFIG = require('config');

//function showToday(auth.ensureAuthenticated, function(req, res) {
exports.showToday = function(req, res) {    
        
        var today = moment();
        
        res.redirect('/day/'+ today.year() +'/' + (today.month()+1) + '/' + today.date());
        
    };


exports.showDay = function(req, res) {
            
        // req.param from URL
        var year = req.params.year;
        var month = req.params.month;
        var day = req.params.day;

        if(!moment(year + "-" + month + "-" + day, "YYYY-MM-DD").isValid()){

            res.redirect('/today');

        } else {

            Calendar.find({}, function(err, docs){
                    
                res.render('dayview.ejs', {
                    calendars: docs || [] ,
                    title : moment(day + '.' + month + '.' + year, "DD.MM.YYYY").format("DD.MM.YYYY"),
                    user: req.user
                });
            });
        }
    };



exports.getDay = function(req, res) {
            
        var year = req.params.year;
        var month = req.params.month;
        var day = req.params.day;

        if(!moment(year + "-" + month + "-" + day, "YYYY-MM-DD").isValid()){

            res.redirect('/today');

        } else {

            Event.atSingleDay([year, month, day], function(err, eventdocs){
                
                var outputObj =
                {
                    "events" : eventdocs || [] ,
                    "date" : moment(day + '.' + month + '.' + year, "DD.MM.YYYY").format("DD.MM.YYYY")
                };
            
            res.send({meta: 200, data: outputObj}, 200);

            });
        }
    };


