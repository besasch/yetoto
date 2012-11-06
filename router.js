var calendarController = require('./controllers/calendarController');
var publicController = require('./controllers/publicController');
var eventController = require('./controllers/eventController');
var userController = require('./controllers/userController');
var passport = require('passport');

module.exports = function(app){

	////////////////////////////////////////////////////////////////////
	/////////// Public Landing Page with Login

	app.get('/', publicController.goToApp);


	////////////////////////////////////////////////////////////////////
	/////////// User

	/*
	 * Redirect the user to Facebook for authentication.  When complete,
	 * Facebook will redirect the user back to the application at /auth/facebook/callback
	 */
	app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_photos'] }));
	/*
	 * Facebook will redirect the user to this URL after approval.  Finish the
	 * authentication process by attempting to obtain an access token.  If
	 * access was granted, the user will be logged in.  Otherwise, authentication has failed.
	 */
	app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/' }));
	app.get('/logout', userController.logoutUser);


	////////////////////////////////////////////////////////////////////
	/////////// JSON API

	app.get('/data/all', userController.getAllData);

	app.get('/data/:year/:month/:day', eventController.getDay);

	app.post('/data/:cal_id/newevent', eventController.createEvent);

	app.post('/data/updateevent', eventController.updateEvent);

	app.post('/data/newcalendar', calendarController.createCalendar);

	app.post('/data/updatecalendar', calendarController.updateCalendar);

	app.get('/data/userCalendars', userController.getUserCalendars);

	app.get('/data/search/:term', calendarController.searchCalendars);

	app.get('/data/subscribe/:calId', userController.subscribeCalendar);

	app.get('/data/unsubscribe/:calId', userController.unsubscribeCalendar);

	app.post('/data/events/:eventId/delete', eventController.deleteEvent);

	app.post('/data/delete/:calId', calendarController.deleteCalendar);


	// DEVELOPMENT

	app.get('/test', publicController.goToAppDEV);

};