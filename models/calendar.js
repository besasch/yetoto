var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var CONFIG = require('config');


var CalendarSchema = new Schema({
    title: String,
    description: String,
    picture: {type: String, default: CONFIG.defaults.calendarPicture},
    events: [{ type: Schema.ObjectId, ref: 'event' }],

    //Meta Data
    creationTime: {type: Date, default: Date.now},
    modificationTime: {type: Date, default: Date.now},
    owner: { type: Schema.ObjectId, ref: 'user' }
});

CalendarSchema.static('getCalendarData', function (id, cb) {

	return this.findById(id)
        .populate('events')
        .populate('owner')
        .exec(cb);
});

CalendarSchema.static('searchCalendars', function (term, cb) {

    return this.find({title: new RegExp(term, 'i')})
        .populate('owner')
        .exec(cb);
});


var Calendar = mongoose.model('calendar', CalendarSchema);


module.exports.Calendar = Calendar;