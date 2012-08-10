var passport = require('passport');

module.exports = function(app){

	// Redirect the user to Facebook for authentication.  When complete,
	// Facebook will redirect the user back to the application at
	// /auth/facebook/callback
	app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_photos'] }));

	// Facebook will redirect the user to this URL after approval.  Finish the
	// authentication process by attempting to obtain an access token.  If
	// access was granted, the user will be logged in.  Otherwise,
	// authentication has failed.
	app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/today', failureRedirect: '/' }));

	app.get('/logout', function(req, res){
		req.logOut();
		res.redirect('/');
	});

};