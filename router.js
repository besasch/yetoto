/**
 * Router
 */
var dayController = require('./routes/day');
var calendarController = require('./routes/calendar');
var eventController = require('./routes/event');
var publicController = require('./routes/public');
var userController = require('./routes/user');
var passport = require('passport');



module.exports = function(app){
// HTML Day
app.get('/today', dayController.showToday);
app.get('/day/:year/:month/:day', dayController.showDay);

//HTML Calendar
app.get('/calendars/new', calendarController.showNewCalendar);
app.get('/calendars/:id', calendarController.showCalendar);
app.post('/calendars', calendarController.createCalendar);
app.put('/calendars/:id', calendarController.updateCalendar); 
app.post('/calendars/:id/delete', calendarController.deleteCalendar);
 
//HTML Event
app.get('/events/:id', eventController.showEvent); 
app.get('calendars/:cal_id/events/:event_id', eventController.showEventInCalender);
app.post('/calendars/:cal_id/events', eventController.createEvent);
app.put('/events/:id', eventController.updateEvent);
app.delete('/calendars/:cal_id/events/:event_id', eventController.deleteEvent); 
 
//HTML Public
app.get('/', publicController.goToStartpage);

//HTML User
/* Redirect the user to Facebook for authentication.  When complete,
* Facebook will redirect the user back to the application at
* /auth/facebook/callback
*/
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_photos'] }));
/* Facebook will redirect the user to this URL after approval.  Finish the
* authentication process by attempting to obtain an access token.  If
* access was granted, the user will be logged in.  Otherwise,
* authentication has failed.
*/
app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/today', failureRedirect: '/' }));
app.get('/profile', userController.showProfile);
app.post('profile', userController.updateProfile);
app.get('/logout', userController.logoutUser); 
 
// JSON API Day
app.get('/data/:year/:month/:day', dayController.getDay);

// JSON API Event
app.get('/data/events/:id', eventController.getEvent);

}