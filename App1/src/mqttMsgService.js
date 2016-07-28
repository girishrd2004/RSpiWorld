// Once the program is stable, run it on raspbian boot : http://raspberrypi.stackexchange.com/questions/8734/execute-script-on-start-up
// Above step is already done, if you want to stop it, then remove last line from .bashrc file (sudo nano .bashrc)
// To npm start from different folder : npm --prefix /home/pi/shared/App1 start & (note that the --prefix is like CD to npm and & for running in background)
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://iot.eclipse.org');
var Hashmap = require('hashmap');
var subscriptionMap = new Hashmap();

client.on('connect', function () {
	console.log('connected to mqtt broker');
});

client.on('message', function (topic, message) {

	var msg = message.toString();
	console.log('Topic : '+ topic + '; Message : ' + msg);
	
	// find if the topic is just a string or the real topic object. If later, find getName
	var handlers = subscriptionMap.get(topic);
	
	for(handler in handlers)
	{
		handler(msg);
	}
	
	lastReceivedMsg = msg;
});

exports.subscribe = function(topicName, msgHandler)
{
	if(!hashmap.has(topicName))
	{
		hashmap.set(topicName, [msgHandler]);
		client.subscribe(topicName);
	}
	else
		hashmap.get(topicName).push(msgHandler);
}

exports.publish = function(topicName, msg)
{
	client.publish(topic,msg);
} 