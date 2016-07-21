var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://iot.eclipse.org');

var greenLED = require('./green_led.js');
var redLED = require('./red_led.js');

var isRedOn = false;
var isGreenOn = false;
client.on('connect', function () {
  client.subscribe('<Topic_Name>');
});
 
client.on('message', function (topic, message) {
  
  var msg = message.toString();
  console.log(message.toString());
  if('IamFree' == msg)
  {
	if(isRedOn)
		redLED.offLED();
	
	greenLED.onLED();
	isGreenOn = true;
  }
  else if('IamBusy' == msg)
  {
	if(isGreenOn)
		greenLED.offLED();
	redLED.onLED();
	isRedOn = true;
  }
  else if('ShutDown' == msg)
  {
	redLED.offLED();
	greenLED.offLED();
	isGreenOn = false;
	isRedOn = false;
  }
});

console.log('waiting for a message');
