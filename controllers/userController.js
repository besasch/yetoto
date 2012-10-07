var User = require('../models/user').User; // mongoose modal verfügbar machen

exports.logoutUser = function(req, res){
	req.logOut();
	res.redirect('/');
};
	
