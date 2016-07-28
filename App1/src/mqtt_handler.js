var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://iot.eclipse.org');

var HashMap = require('hashmap');
var map = new HashMap();

var isConnected = false;
client.on('connect', function () {
  isConnected = true;
});

exports.subscribeMe = function(topicName, listener){
	client.subscribe(topicName);
	map.put(topicName, listener);
};
 
client.on('message', function (topic, message) {
  
  var msg = message.toString();
  console.log(message.toString());
}

function exit(){
	
}

console.log('waiting for a message');
