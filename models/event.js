var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var EventSchema = new Schema({
    creationTime: {type: Date, default: Date.now},
    modificationTime: {type: Date, default: Date.now},
    title: String,
    startTime: Date,
    endTime: Date,
    location: String,
    body: String,
    _calendar: { type: Schema.ObjectId, ref: 'calendar' },
    owner: { type: Schema.ObjectId, ref: 'user' }
});

EventSchema.static('atSingleDay', function (d, cb) {

	var from = new Date(d[0], d[1] - 1, d[2], 0, 0, 0);
    var until = new Date(d[0], d[1] - 1 , d[2], 23, 59, 59);

	return this.where('startTime').gte(from).lte(until)
        .sort('startTime')
        .populate('_calendar', 'picture')
        .exec(cb);
});


var Event = mongoose.model('event', EventSchema);

module.exports.Event = Event;