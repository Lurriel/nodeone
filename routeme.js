var express = require('express');
var app = express();
var birds = require('./js/path');

app.use('/birds', birds);

//REDIRECT ON 404 - wrong one..
// app.get('*', function(req, res){
//   //res.send('what???', 404);
//   res.redirect('/birds');
// });

var cb0 = function (req, res, next) {
  console.log('CB0');
  next();
}
var cb1 = function (req, res, next) {
  console.log('CB1');
  next();
}
var cb2 = function (req, res) {
  res.send('Hello from C!');
}
app.get('/example/c', [cb0, cb1, cb2])




app.listen(3000, function(){
  console.log('App is now listening on 3000 port');
});
module.exports = app;
