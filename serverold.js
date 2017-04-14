var express = require('express');
var app = express();
// var passport = require('passport-oauth2-middleware');
var passport = require('passport');

var GithubStrategy = require('passport-github').Strategy;
// Express and Passport Session
var session = require('express-session');
app.use(session({secret: "666666662342ss"}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GithubStrategy({
    clientID: "b85cf344f8b15053af61",
    clientSecret: "43603a9cdaac3435bffe6575814b1950293780c9",
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

passport.serializeUser(function(user, done) {
  // placeholder for custom user serialization
  // null is for errors
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  // placeholder for custom user deserialization.
  // maybe you are going to get the user from mongo by id?
  // null is for errors
  done(null, user);
});

// we will call this to start the GitHub Login process
app.get('/auth/github', passport.authenticate('github'));

// GitHub will call this URL
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  }
);

// Simple middleware to ensure user is authenticated.
// Use this middleware on any resource that needs to be protected.
// If the request is authenticated (typically via a persistent login session),
// the request will proceed.  Otherwise, the user will be redirected to the
// login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    // req.user is available for use here
    return next(); }

  // denied. redirect to login
  console.log("access denied under path '/protected'");
  res.redirect('/')
}

app.get('/protected', ensureAuthenticated, function(req, res) {
  var html = "access granted. secure stuff happens here<ul>\
  <ul>\
  <li><a href='/'>Home</a></li>\
  <ul>"
  res.send(html);
});

// main menu route
app.get('/', function (req, res) {
  var html = "<ul>\
    <li><a href='/auth/github'>GitHub</a></li>\
    <li><a href='/logout'>logout</a></li>\
    <li><a href='/protected'>Secret room</a></li>\
  </ul>";
  // dump the user for debugging
  if (req.isAuthenticated()) {
    html += "<p>authenticated as user:</p>";
    html += "<pre>" + JSON.stringify(req.user, null, 4) + "</pre>";
  }
  res.send(html);
});

app.get('/logout', function(req, res){
  console.log('logging out');
  req.logout();
  res.redirect('/');
});

var server = app.listen(3000, function () {
  console.log('Example app listening at http://%s:%s',
    server.address().address, server.address().port);
});
