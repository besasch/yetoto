var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var EventSchema = new Schema({

    title: String,
    startDate: Date,
    endDate: Date,
    location: String,
    content: String,
    _calendar: { type: Schema.ObjectId, ref: 'calendar' },

    // Meta Data
    creationTime: {type: Date, default: Date.now},
    modificationTime: {type: Date, default: Date.now},
    owner: { type: Schema.ObjectId, ref: 'user' }
});

EventSchema.static('getAllEventsByDate', function (inputDate, cb) {

	var from = new Date(inputDate[0], inputDate[1] - 1, inputDate[2], 0, 0, 0);
    var until = new Date(inputDate[0], inputDate[1] - 1 , inputDate[2], 23, 59, 59);

console.log('from: '+from);
console.log('until: '+until);

	return this.where('startDate').gte(from).lte(until)
        .sort('startDate')
        .populate('_calendar', 'picture')
        .exec(cb);
});


var Event = mongoose.model('event', EventSchema);

module.exports.Event = Event;