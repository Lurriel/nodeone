var express = require('express');
var app = express();
var path = require("path");

app.get('/', function (req, res) {
	var html = "Hello Lurriel </br>\
	<ul>\
	<li><a href='/example/b'>Example</a></li>\
	<li><a href='/static'>Static content</a></li>\
	</ul>\
	"
	res.send(html);
});

app.get('/static', function (req, res) {
	res.sendFile(path.join(__dirname+'/static/hello.html'));
});
app.get('/images', function (req, res) {
	res.sendFile(path.join(__dirname+'/images/manson.png'));
});
app.get('/users/:userId/books/:bookId', function (req, res) {
  res.send(req.params)
});

app.get('/example/b', function (req, res, next) {
  console.log('the response will be sent by the next function ...')
  next();
}, function (req, res) {
  res.send('Hello from B!')
});

app.listen(3000, function() {
	console.log('App is istening on 3000 port');
});
