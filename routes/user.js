var passport = require('passport');
var User = require('../models/user').User; // mongoose modal verfügbar machen

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
	
	app.get('/profile', function (req, res){
		console.log(req.user._id);

            User.findById(req.user._id, function(err, doc){

                res.render('profile.ejs', {
                    user: doc,
                	layout:'public-layout',
                	title: "Profile of " + req.user.firstname + " " + req.user.lastname
                	
                });
                
            });

	
	});

	app.post('/profile', function(req, res){
		
		User.findById(req.user._id, function(err, doc){

               doc.prefLocation =  req.body.prefLocation;
               doc.save(function(err) {
		            if (err) {
		                console.log('error changing user data');
		                console.log(err);
		            } else {
		                console.log('user data successfully changed');
		                res.redirect('/profile');
		             
		            }
        });

               
                
            });

		
	}
	
	 )
};