var http    = require('http');
var fs      = require('fs');
var urll    = require('url');

imageHelpers = {

	// Retrieves a picture from a URL and saves it.
    getImg: function(o, cb){
        var port    = o.port || 80,
            url     = urll.parse(o.url);

        var options = {
          host: url.hostname,
          port: port,
          path: url.pathname
        };

        http.get(options, function(res) {
            console.log("Got response: " + res.statusCode);
            console.log('destination: ' + o.dest);
            res.setEncoding('binary');
            var imagedata = '';
            res.on('data', function(chunk){
                imagedata+= chunk;
            });
            res.on('end', function(){
                fs.writeFile(o.dest, imagedata, 'binary', cb);
            });
        }).on('error', function(e) {
            console.log(":-( Got error: " + e.message);
        });
    },

    getFbRedirectUrl: function(u, next){
        
        url     = urll.parse(u);

        http.get(url, function(res) {
            var body = '';

            res.on('data', function(chunk) {
                body += chunk;
            });

            res.on('end', function() {
                var fb = JSON.parse(body);
                
                next(fb.picture);
            });

        }).on('error', function(e) {
          console.log(":-( Got error: " + e.message);
        });
    }
};

module.exports = imageHelpers;