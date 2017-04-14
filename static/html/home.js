var htmlContent = function (){
  return "<h1>{{welcomeMessage}}</h1>"+
        "<h2>{{helloContent}}</h2>"+
        "</br>Entry selected: {{entry}}</br>"+
        "<a href='/hbs'> link to hbs plugin example</a>"+
        "</br></br>This is pure Handlebars example.</br>Complie template and display with 'req.send(tmp)'";
}
module.exports = htmlContent;
