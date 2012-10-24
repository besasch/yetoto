var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
    
    firstname: String,
    lastname: String,
    email: String,
    description: String,
    prefLocation: String,
	subscriptions: [{ type: Schema.ObjectId, ref: 'calendar' }],
	userCalendars: [{ type: Schema.ObjectId, ref: 'calendar' }],

    accounts: [],
    // Facebook Data:
    // provider: String,
	// uid: String,
	// image: String

    // Meta Data
    creationTime: {type: Date, default: Date.now},
    modificationTime: {type: Date, default: Date.now}
});

UserSchema.static('getUserCalendars', function (userID, cb) {

	return this.findById(userID, 'userCalendars subscriptions')
        .populate('userCalendars')
		.populate('subscriptions')
        .exec(cb);
});

UserSchema.static('getUserWithCalendarData', function (userID, cb) {

    return this.findById(userID)
        .populate('userCalendars')
        .populate('subscriptions')
        .exec(cb);
});

UserSchema.static('subscribeCalendar', function (calendarObj, userId, cb) {

    // Find relevant user
    this.findById(userId, function(err, userdoc){
        
        var error = null;

        if(err){
            error = "Error finding user: " + err;
        }

        // Check if user has already subscribed to it
        var i = userdoc.subscriptions.length;
        while (i--) {
           if (String(userdoc.subscriptions[i]) == String(calendarObj._id)) {
                error = 'User already subscribed this calendar';
           }
        }

        // Check if the user is already owner of that calendar
        var j = userdoc.userCalendars.length;
        while (j--) {
           if (String(userdoc.userCalendars[j]) == String(calendarObj._id)) {
                error = 'This is the users calendar. So he can not subscribe to it';
           }
        }

        userdoc.subscriptions.push(calendarObj);

        userdoc.save(function(err) {
            if (err) {
                error = 'Error subscribing calendar: '+err;
            } else {
                cb(error, userdoc);
            }
        });
    });

});


UserSchema.static('unsubscribeCalendar', function (calendarObj, userId, cb) {

    // Find relevant user
    this.findById(userId, function(err, userdoc){

        var error = null;

        if(err){
            error = "Error finding user: " + err;
        }

        // Check if user has subscribed to it
        var i = userdoc.subscriptions.length;
        while (i--) {

            if (String(userdoc.subscriptions[i]) == String(calendarObj._id)) {
                // If so remove it
                userdoc.subscriptions.remove(calendarObj._id);
                // Then save it
                userdoc.save(function(err) {
                    if (err) {
                        error = 'Error unsubscribing calendar: '+err;
                    } else {
                        cb(error, userdoc);
                    }
                });
            } else {
                error = 'User has not subscribed this calendar';
            }
        }
    });

});



var User = mongoose.model('user', UserSchema);

module.exports.User = User;