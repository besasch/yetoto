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

        res.redirect('/today');

    } else {

        Event.atSingleDay([year, month, day], function(err, eventdocs){
            
            var outputObj =
            {
                "events" : eventdocs || []
            };
        
        res.send({meta: 200, data: outputObj}, 200);

        });
    }
};