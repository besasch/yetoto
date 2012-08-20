/**
 * Router
 */
var dayController = require('./routes/day');
var calendarController = require('./routes/calendar');


module.exports = function(app){
// HTML Day
app.get('/today', dayController.showToday);
app.get('/day/:year/:month/:day', dayController.showDay);

//HTML Calendar
app.get('/calendars', calendarController.showNewCalendar);
app.get('/calendars/:id', calendarController.showCalendar);
app.post('/calendars', calendarController.createCalendar);
app.put('/calendars/:id', calendarController.updateCalendar); 
app.delete('/calendars/:id', calendarController.deleteCalendar);
 
 // JSON API Day
app.get('/data/:year/:month/:day', dayController.getDay);

}