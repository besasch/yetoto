var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CONFIG = require('config');


var CalendarSchema = new Schema({
    creationTime: {type: Date, default: Date.now},
    modificationTime: {type: Date, default: Date.now},
    title: String,
    description: String,
    picture: {type: String, default: CONFIG.defaults.calendarPicture},
    events: [{ type: Schema.ObjectId, ref: 'event' }],
    owner: { type: Schema.ObjectId, ref: 'user' }
});

CalendarSchema.static('getCalendarData', function (id, cb) {

	return this.findById(id)
        .populate('events')
        .populate('owner')
        .exec(cb);
});


var Calendar = mongoose.model('calendar', CalendarSchema);


module.exports.Calendar = Calendar;