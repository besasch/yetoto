var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
	
    creationTime: {type: Date, default: Date.now},
    modificationTime: {type: Date, default: Date.now},
    
    firstname: String,
    lastname: String,
    email: String,
    description: String,
    prefLocation: String,
	subscriptions: [{ type: Schema.ObjectId, ref: 'calendar' }],
	userCalendars: [{ type: Schema.ObjectId, ref: 'calendar' }],

    accounts: []
    // Facebook Data:
    // provider: String,
	// uid: String,
	// image: String
});


var User = mongoose.model('user', UserSchema);

module.exports.User = User;