helper = require('../helper/dateHelper.js');
auth = require('../helper/authHelper.js');
var moment = require('moment');

// Requiring the model
var Calendar = require('../models/calendar').Calendar;
var Event = require('../models/event').Event;

// getting the Config
var CONFIG = require('config');

module.exports = function(app){

    app.get('/today', auth.ensureAuthenticated, function(req, res) {
         
        var today = moment();

        res.redirect('/day/'+ today.year() +'/' + (today.month()+1) + '/' + today.date());
    });


    app.get('/day/:year/:month/:day', auth.ensureAuthenticated, function(req, res) {
            
        var year = req.params.year;
        var month = req.params.month;
        var day = req.params.day;

        if(!moment(year + "-" + month + "-" + day, "YYYY-MM-DD").isValid()){

            res.redirect('/today');

        } else {

            Calendar.find({}, function(err, docs){

                Event.atSingleDay(year, month, day, function(err, eventdocs){
                    
                    res.render('dayview.ejs', {
                        calendars: docs || [] ,
                        events : eventdocs || [] ,
                        title : moment(day + '.' + month + '.' + year, "DD.MM.YYYY").format("DD.MM.YYYY"),
                        nextDayUrl : "/day/" + moment([year, month-1, day]).add('d', 1).format("YYYY/MM/DD"),
                        daybeforeUrl : "/day/" + moment([year, month-1, day]).subtract('d', 1).format("YYYY/MM/DD"),
                        user: req.user
                    });
                });
            });
        }
    });


    app.get('/data/:year/:month/:day', auth.ensureAuthenticated, function(req, res) {
            
        var year = req.params.year;
        var month = req.params.month;
        var day = req.params.day;

        if(!moment(year + "-" + month + "-" + day, "YYYY-MM-DD").isValid()){

            res.redirect('/today');

        } else {

            Event.atSingleDay(year, month, day, function(err, eventdocs){
                
                var outputObj =
                {
                    "events" : eventdocs || [] ,
                    "date" : moment(day + '.' + month + '.' + year, "DD.MM.YYYY").format("DD.MM.YYYY")
                };
            
            res.send({meta: 200, data: outputObj}, 200);

            });
        }
    });


};