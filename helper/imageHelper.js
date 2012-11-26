var http    = require('http');
var fs      = require('fs');
var urll    = require('url');
var CONFIG  = require('config');
var knox    = require('knox');

imageHelpers = {

	// Retrieves a picture from a URL and saves it.
    uploadImageToS3ByUrl: function(imageUrl, fileName, cb){
        var port    = 80;
        var url     = urll.parse(imageUrl);

        var options = {
          host: url.hostname,
          port: port,
          path: url.pathname
        };

        var client = knox.createClient({
            key: CONFIG.s3.key,
            secret: CONFIG.s3.secret,
            bucket: CONFIG.s3.bucket
        });

        http.get(options, function(response) {
        var request = client.put(fileName, {
          'Content-Length': response.headers['content-length'],
          'Content-Type': response.headers['content-type'],
          'x-amz-acl': 'public-read'
        });

        response.on('data', function(data) {
          request.write(data);
        }).on('end', function() {
          request.end();
        });

        request.on('response', function(resp) {
          console.log('S3 status:', resp.statusCode, 'url:', request.url);
          cb(request.url);
        });

        request.on('error', function(err) {
          console.error('Error uploading to s3:', err);
        });

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

                next(fb.picture.data.url);
            });

        }).on('error', function(e) {
          console.log(":-( Got error: " + e.message);
        });
    },

    saveBase64ToDisk: function(image, location, cb){

        //Write image to file system
        var dataBuffer = new Buffer(image, 'base64');
        fs.writeFile(location, dataBuffer, cb);
    },

    isImageUpload: function(input){
        var base64 = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$");
        if (base64.test(input)){
            return true;
        }
        return false;
    },

    uploadBase64ToS3: function(image, type, filename, callback){
        var client = knox.createClient({
            key: CONFIG.s3.key,
            secret: CONFIG.s3.secret,
            bucket: CONFIG.s3.bucket
        });

        var dataBuffer = new Buffer(image, 'base64');
        var req = client.put(filename, {
            'Content-Length': dataBuffer.length,
            'Content-Type': 'image/' + type,
            'x-amz-acl': 'public-read'
        });
        req.on('response', function(res){
          if (200 == res.statusCode) {
            callback(req.url);
          }
        });
        req.end(dataBuffer);
    },

    deleteImgFromS3: function(fileUrl, cb){
        var client = knox.createClient({
            key: CONFIG.s3.key,
            secret: CONFIG.s3.secret,
            bucket: CONFIG.s3.bucket
        });

        var url = urll.parse(fileUrl);

        client.deleteFile(url.pathname, function(err, res){
            cb(err, res);
        });
    }
};

module.exports = imageHelpers;