// Once the program is stable, run it on raspbian boot : http://raspberrypi.stackexchange.com/questions/8734/execute-script-on-start-up
// Above step is already done, if you want to stop it, then remove last line from .bashrc file (sudo nano .bashrc)
// To npm start from different folder : npm --prefix /home/pi/shared/App1 start & (note that the --prefix is like CD to npm and & for running in background)
var greenLED = require('./green_led.js');
var redLED = require('./red_led.js');
var activeBuzzer = require('./active_buzzer.js');
var buttonForBuzzer = require('./button_ctrl_buzzer.js');
var mqttMsgService = require('./mqttMsgService.js');
var shiftRegForLED = require('./shiftRegForLED.js');

var isBuzzerOn = false;
var lastReceivedMsg = null;

mqttMsgService.subscribe('Girish_DPi', function evaluateMsg(msg) {

	console.log('controller : Let us evalutate msg :'+ msg);
	
	if(!('Start' == msg || 'ShutDown' == msg))
		lastReceivedMsg = msg;
	
	if ('Start' == msg) {
		msg = lastReceivedMsg;
		console.log('controller : Using the previous state :'+ msg);
	}
	
	if ('IamFree' == msg) {
		iAmFree();
	} else if ('IamBusy' == msg) {
		iAmBusy();
	} else if ('AlertWife' == msg) {
		alertWife();
	} else if ('StopBuzzer' == msg) {
		stopBuzzer();
	} else if ('ShutDown' == msg) {
		shutdown();
	}else if ('Exit' == msg) {
		exit();
	}
});

function stopBuzzer(){
	activeBuzzer.offBuzzer();
}

function shutdown() {
	console.log('controller :  shutdown()');
	shiftRegForLED.shutdown();
	activeBuzzer.shutdown();
	buttonForBuzzer.shutdown();
	isBuzzerOn = false;
}

function iAmFree() {

	console.log('controller : Set status -> I am free');
	shiftRegForLED.blinkLED('green')
}

function iAmBusy() {

	console.log('controller : Set status -> I am busy');
	shiftRegForLED.blinkLED('red')
}

function alertWife() {

	console.log('controller : Alert wife');
	activeBuzzer.onBuzzer();
	buttonForBuzzer.watch(activeBuzzer);
	isBuzzerOn = true;
}
function exit() {
	shutdown();
	process.exit();
}

process.on('SIGINT', exit);
