var mycontroller = function(){
  var messageToReturn = 'Hello happy controller!';
  return {
    getText: function() {
      return messageToReturn;
    },
    setText: function(newText) {
      messageToReturn = newText;
    }
  }
}
module.exports = mycontroller;
