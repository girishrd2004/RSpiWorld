// Once the program is stable, run it on raspbian boot : http://raspberrypi.stackexchange.com/questions/8734/execute-script-on-start-up
// Above step is already done, if you want to stop it, then remove last line from .bashrc file (sudo nano .bashrc)
// To npm start from different folder : npm --prefix /home/pi/shared/App1 start & (note that the --prefix is like CD to npm and & for running in background)
var mqtt = require('mqtt');
var mqttBroker = 'mqtt://iot.eclipse.org';
var client = mqtt.connect(mqttBroker);
var hashmap = require('hashmap');
var subscriptionMap = new hashmap.HashMap();

var isConnected = false;

client.on('connect', function () {
		console.log('mqttMsgService : connected to mqtt broker ->' + mqttBroker);
		
		subscriptionMap.forEach(function(value, key){
			client.subscribe(key);
			console.log('mqttMsgService : one subscirber added to topic : '+ key);
		});
	
		isConnected = true;
	});

client.on('message', function (topic, message) {

	var msg = message.toString();
	console.log('mqttMsgService : Topic -> '+ topic + '; Message -> ' + msg);
	
	// find if the topic is just a string or the real topic object. If later, find getName
	var handlers = subscriptionMap.get(topic);
	
	handlers.forEach(function(fn, index){
			fn(msg);
		});
});

exports.subscribe = function(topicName, msgHandler)
{
	if(!subscriptionMap.has(topicName))
	{
		subscriptionMap.set(topicName, [msgHandler]);
		
		// otherwise on connect the subscriptions will be added.
		if(isConnected)
			client.subscribe(topicName);
	}
	else
		subscriptionMap.get(topicName).push(msgHandler);
	if(isConnected)
		console.log('one subscirber added to topic : '+ topicName);
}

exports.publish = function(topicName, msg)
{
	client.publish(topic,msg);
} 

console.log(' waiting for a message ');