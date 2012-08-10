var moment = require('moment');

dateHelpers = {
	
	formatDate: function(date){
		return moment(date).format('YYYY-MM-DD hh:mm:ss');
	},
	fromNow: function(date){
		moment(date).fromNow();
	}
};

module.exports = dateHelpers;