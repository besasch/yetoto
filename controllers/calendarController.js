var helper = require('../helper/dateHelper.js');
var auth = require('../helper/authHelper.js');
var moment = require('moment');
var Calendar = require('../models/calendar').Calendar;
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
