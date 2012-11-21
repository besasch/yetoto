var express          = require('express');
var mongoose         = require('mongoose');
var MongoStore       = require('connect-mongo')(express);
var passport         = require('passport');
var CONFIG           = require('config');

// Handle all authentication
require('./authentication');

var app = module.exports = express();

// configure express
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.engine('.html', require('ejs').__express);
  app.set('view engine', 'html');
  app.use(express.cookieParser());
  app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + "/public" + CONFIG.images.dir }));
  app.use(express.methodOverride());
  //app.use(express.session({ secret: "keyboard cat" }));
  app.use(express.session({
    secret: "victory cat",
    store: new MongoStore({
      url: CONFIG.dbMongo.url
      })
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  
});


//env specific config
app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

    mongoose.connect(CONFIG.dbMongo.url);
});

app.configure('production', function(){
    app.use(express.errorHandler());

    mongoose.connect(CONFIG.dbMongo.url);
});

// Routes
require('./router')(app);


// Start le app
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}

