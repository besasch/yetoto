var User = require('../models/user').User; // mongoose modal verfügbar machen


exports.logoutUser = function(req, res){
		req.logOut();
		res.redirect('/');
	};
//authentication must be added here!
exports.showProfile = function (req, res){
		console.log(req.user._id);

            User.findById(req.user._id, function(err, doc){

                res.render('profile.ejs', {
                    user: doc,
                	layout:'public-layout',
                	title: "Profile of " + req.user.firstname + " " + req.user.lastname
                	
                });
                
            });

	
	};
//authentication must be added here!
exports.updateProfile = function(req, res){
		
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
		 
	
};
