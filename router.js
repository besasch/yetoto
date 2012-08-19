/**
 * Router
 */
var dayController = require('./routes/day');

module.exports = function(app){
// HTML
app.get('/today', dayController.showToday);
app.get('/day/:year/:month/:day', dayController.showDay);
 
 
 // JSON API
app.get('/data/:year/:month/:day', dayController.getDay);

}