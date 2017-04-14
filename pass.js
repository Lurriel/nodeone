var express = require('express');
var app = express();
var passport = require('passport-oauth2');
var sanitize = require("mongo-sanitize");
var path = require("path");
var mongoose = require('mongoose');
var textContent = require('./static/json/home');
var htmlContent = require('./static/html/home');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var controller = require('./controllers/mycontroller');
controller = new controller();

var Handlebars = require('handlebars');
var hbs = require('hbs');


app.set('view engine', 'html');
app.engine('html', hbs.__express);

console.log(controller.getText());
controller.setText('New Text ^^');
console.log(controller.getText());
console.log(htmlContent());

mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected');
  // we're connected!
});
var kittySchema = mongoose.Schema({
    name: String
});

kittySchema.methods.speak = function () {
  var greeting = this.name
    ? "Meow name is " + this.name
    : "I don't have a name";
  console.log(greeting);
}

var Kitten = mongoose.model('Kitten', kittySchema);
var silence = new Kitten({ name: 'Silence' });
var fluffy = new Kitten({ name: 'fluffy' });
// fluffy.speak(); // "Meow name is fluffy"
console.log(silence.name); // 'Silence'
fluffy.speak(); // 'Silence'
//
// fluffy.save(function (err, fluffy) {
//   if (err) return console.error(err);
//   fluffy.speak();
// });

Kitten.find(function (err, kittens) {
  if (err) return console.error(err);
  console.log(kittens);
});

app.get('/findcat/:name', function(req, res) {
  // db.kittens.remove({'name': 'kot'});
  //var item = db.kittens.remove();
  req.params = sanitize(req.params);
  var searchFor = req.params.name;
  var display = 'Nothing to show';
  var coll = db.db.collection('kittens', function(err, collection){

    collection.find({'name': searchFor}).toArray(function(err, data){
      console.log('KITT');
      console.log(data);
      res.send(data);
    });
  });
  // console.log(db.db.collection);
});

app.get('/', function (req, res) {
	var html = "Hello Lurriel</br> \
  <h2>Passport-oauth2 test</h2>\
	<ul>\
	<li><a href='/example/b'>Example</a></li>\
	<li><a href='/static'>Static content</a></li>\
	</ul>\
	"
  var source = "<p>Hello, my name is {{name}}. I am from {{hometown}}."
              "+ I have " +
             "{{kids.length}} kids:</p>" +
             "<ul>{{#kids}}<li>{{name}} is {{age}}</li>{{/kids}}</ul>";
  var template = Handlebars.compile(source);
  var data = { "name": "Alan", "hometown": "Somewhere, TX",
             "kids": [{"name": "Jimmy", "age": "12"},
                      {"name": "Sally", "age": "4"}
             ]};
  var result = template(data);

  var tmp = Handlebars.compile(htmlContent());
  var toDisplay = tmp(textContent);
	res.send(toDisplay);
});
app.get('/hbs', function(req, res) {

  var hbsData = {testMessage:'Message 1', secondMessage:'Message 2'};
  res.render('index', hbsData); //index comes from default views
});
//POST PART
app.get('/login', function(req, res) {
  res.render('login', {});
});
//POST
app.post('/login',function(req,res){
  var user_name=req.body.user;
  var password=req.body.password;
  console.log("User name = "+user_name+", password is "+password);
  console.log(req.body);
  res.end("yes");
});

app.get('/addkitten/:name', function(req, res) {
  req.params = sanitize(req.params);
  console.log(req.params.name);
  var newKitten = new Kitten({name: req.params.name});
  console.log('----------------------');
  saveKitten( newKitten );
  Kitten.find(function (err, kittens) {
    if (err) return console.error(err);
    console.log(kittens);
  });
});

var saveKitten = function( kittenToSave ){
  kittenToSave.save(function (err, kittenToSave) {
    if (err) return console.error(err);
    kittenToSave.speak();
  });
}

app.listen(3000, function() {
	console.log('App is istening on 3000 port');
});
