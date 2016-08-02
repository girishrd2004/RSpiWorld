var Gpio = require('onoff').Gpio;

// Integer to 8 Bit array : console.log(("000000000" + n.toString(2)).substr(-8));
// TODO need to find a way to send all 8bits before storing the data and display. That was we can make only green/red LEDs to blink
// http://www.nudatech.com/blog/using-a-shift-register-74hc595n-with-arduino/

/*
ref: https://www.perkin.org.uk/posts/a-nodejs-powered-8-bit-cpu-part-two.html
Data is read in from DS, using the SHCP clock to load one bit per clock cycle. After doing this 8 times, the data we want to load is now ready in the “8-stage shift register” shown above.

To load the 8-bits from the shift register into the storage register, a single clock cycle is required on the STCP clock. As soon as that happens, the data is latched into the “8-bit storage register”.
*/

/*
ref: http://www.protostack.com/blog/2010/05/introduction-to-74hc595-shift-register-controlling-16-leds/
When pin 11 (SH_CP or SRCLK on some datasheets) goes from Low to High the value of DS is stored into the shift register and the existing values of the register are shifted to make room for the new bit.

Pin 12 (ST_CP or RCLK on some datasheets) is held low whilst data is being written to the shift register. When it goes High the values of the shift register are latched to the storage register which are then outputted to pins Q0-Q7.
*/
// TODO this means that instead of shorting pin 11 and 12. I should use pin 11 to load 8bits and then a single HIGH on pin 12 should load the data from shift register to storage. Thus using all 8 bits as single input to 8 LEDs
var resetFeed = [0, 0, 0, 0, 0, 0, 0, 0];

var isStarted = false;
var base = 2;
var power = 0;
var runIV = null;
var pauseIV = null;

var pinLatch = null;
var pinClk = null;
var pinDS = null;

var speed = 1;

function getArray(num)
{
	return (("000000000" + num.toString(2)).substr(-8)).split('');
}

function init(){
	pinLatch = new Gpio(25, 'out');
	pinClk = new Gpio(24, 'out');
	pinDS = new Gpio(18, 'out');
	pinClk.writeSync(0);
	isStarted = true;
}

function blink(redOrGreen)
{
	console.log('shiftRegForLED : blink ->redOrGreen :'+redOfGreen)
	var toggleSwitch = false;
	pauseIV = setInterval(function(){
		toggleSwitch = !toggleSwitch;
		if(toggleSwitch)
		{
			// for Red = 0 - 3 and for Green = 4 - 7 (keep looping)
			if(redOrGreen)
				power = 0;
			else
				power = 4;
				
			var counter = 0; //( should be 0 <= counter < 4 always, otherwise reset or decreament);
			runIV = setInterval(function clock() {

				counter = counter % 4 + power;
				
				var feed = getArray(Math.pow(base, counter++));
				pinClk.writeSync(0);
				while (feed.length)
				{
					var sh = feed.shift();
					pinLatch.writeSync(0);
					pinDS.writeSync(parseInt(sh));
					pinLatch.writeSync(1);
				}
				pinClk.writeSync(1);
			}, 250 / speed);
		}else
		{
			clearInterval(runIV);
			turnOffAll();
		}
	}, 5000 / speed);
}

function turnOffAll()
{
	var resetFeedClone = resetFeed.slice(0, resetFeed.length-1);
	pinClk.writeSync(0);
	while (resetFeedClone.length)
	{
		var sh = resetFeedClone.shift();
		pinLatch.writeSync(0);
		pinDS.writeSync(sh);
		pinLatch.writeSync(1);
	}
	pinClk.writeSync(1);
}

function reset(){
	console.log('shiftRegForLED : reset()');

	if(!isStarted)
		init();
	// This is appropriate as there is no point without shutting down the blicker!
	clearInterval(runIV);
	clearInterval(pauseIV);
	turnOffAll();
}	

function shutdown()
{
	if(isStarted)
	{
		console.log('shiftRegForLED : shutdown()');
		reset();
		pinLatch.unexport();
		pinDS.unexport();
		pinClk.unexport();
		isStarted = false;
	}
}

exports.blinkLED = function(type){
	shutdown();
	reset();
	if(type == 'red')
		blink(true);
	else
		blink(false);
}

exports.shutdown = function(){shutdown();};