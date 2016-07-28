// Once the program is stable, run it on raspbian boot : http://raspberrypi.stackexchange.com/questions/8734/execute-script-on-start-up
// Above step is already done, if you want to stop it, then remove last line from .bashrc file (sudo nano .bashrc)
// To npm start from different folder : npm --prefix /home/pi/shared/App1 start & (note that the --prefix is like CD to npm and & for running in background)
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://iot.eclipse.org');
var hashmap = require('hashmap');

client.on('connect', function () {
	client.subscribe('Girish_DPi');
});

client.on('message', function (topic, message) {

	var msg = message.toString();
	console.log('Message received :' + msg);
	evaluateMsg(msg);
	lastReceivedMsg = msg;
});

exports.subscribe = function(topicName, msgHandler)
{
	
}