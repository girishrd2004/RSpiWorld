// Once the program is stable, run it on raspbian boot : http://raspberrypi.stackexchange.com/questions/8734/execute-script-on-start-up
// Above step is already done, if you want to stop it, then remove last line from .bashrc file (sudo nano .bashrc)
// To npm start from different folder : npm --prefix /home/pi/shared/App1 start & (note that the --prefix is like CD to npm and & for running in background)
var greenLED = require('./green_led.js');
var redLED = require('./red_led.js');
var activeBuzzer = require('./active_buzzer.js');
var buttonForBuzzer = require('./button_ctrl_buzzer.js');
var mqttMsgService = require('./mqttMsgService.js');

var isRedOn = false;
var isGreenOn = false;
var isBuzzerOn = false;
var lastReceivedMsg = null;

mqttMsgService.subscribe('Girish_DPi', function evaluateMsg(msg) {
	if (' IamFree ' == msg) {
		iAmFree();
	} else if (' IamBusy ' == msg) {
		iAmBusy();
	} else if (' AlertWife ' == msg) {
		alertWife();
	} else if (' StopBuzzer ' == msg) {
		stopBuzzer();
	} else if (' ShutDown ' == msg) {
		exit();
	}
});

function stopBuzzer(){
	activeBuzzer.offBuzzer();
}

function shutdown() {
	console.log(' shutdown called ');
	redLED.offLED();
	greenLED.offLED();
	activeBuzzer.offBuzzer();
	buttonForBuzzer.stop();
	isGreenOn = false;
	isRedOn = false;
	isBuzzerOn = false;
}

function iAmFree() {

	if (isRedOn)
		redLED.offLED();

	greenLED.onLED();
	isGreenOn = true;
}

function iAmBusy() {

	if (isGreenOn)
		greenLED.offLED();
	redLED.onLED();
	isRedOn = true;
}

function alertWife() {
	activeBuzzer.onBuzzer();
	buttonForBuzzer.watch(activeBuzzer);
	isBuzzerOn = true;
}
function exit() {
	shutdown();
	process.exit();
}

process.on(' SIGINT ', exit);
