var passport         = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var User             = require('./models/user').User;
var Calendar         = require('./models/calendar').Calendar;
var imageHelper      = require('./helper/imageHelper');
var CONFIG           = require('config');

// Authentication Strategy
passport.use(new FacebookStrategy({
    clientID: CONFIG.fb.appId,
    clientSecret: CONFIG.fb.appSecret,
    callbackURL: CONFIG.fb.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      User.findOne({ 'accounts.uid': profile.id, 'accounts.provider': 'facebook' }, function(err, olduser) {

          if(olduser) {
            console.log(':-) User-Login (' + olduser.firstname + ' ' + olduser.lastname + ')');
            done(null, olduser);
          } else {
            var newuser       = new User();
            var account       = {provider: "facebook", uid: profile.id};
            newuser.accounts.push(account);
            newuser.firstname = profile.name.givenName;
            newuser.lastname  = profile.name.familyName;
            newuser.email     = profile._json.email;

            usercalendar = new Calendar();
            usercalendar.title = 'Yetoto of ' + newuser.firstname + ' ' + newuser.lastname;
            usercalendar.description = 'This is the personal yetoto of ' + newuser.firstname + ' ' + newuser.lastname;
            usercalendar.owner = newuser._id;

            imageHelper.getFbRedirectUrl("http://graph.facebook.com/" + profile.id + "/?fields=picture",
              function(pictureUrl){
                imageHelper.uploadImageToS3ByUrl(pictureUrl, profile.id + "." + 'jpg', function(imageUrl){
                    usercalendar.picture = imageUrl;
                    usercalendar.save(function(err) {
                      if(err) { throw err; }
                      newuser.userCalendars.push(usercalendar);
                      newuser.save(function(err) {
                        if(err) { throw err; }
                        console.log(':-) New user created (' + newuser.firstname + ' ' + newuser.lastname + ')');
                        done(null, newuser);
                      });
                    });
                });
              });
          }
        });
    });
  }
));


// Passport session setup.
passport.serializeUser(function(user, done) {

  //console.log(':-) Serializing (' + user._id + ')');

  done(null, user._id);
});

passport.deserializeUser(function(_id, done) {
  User.findById(_id ,function(err, user){
    //console.log(':-) Deserializing (' + user._id + ')');
    done(err, user);
  });
});