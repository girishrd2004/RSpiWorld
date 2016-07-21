var Gpio = require('onoff').Gpio;
var led = null;
var GPIO_PORT = 25;
var isStarted = false;

var iv = null;
var ivInternal = null;

exports.onLED = function(){
	if(!isStarted)
	{
	  console.log('export GPIO port : '+ GPIO_PORT);
	  
	  led = new Gpio(GPIO_PORT, 'out');
	  isStarted = true;
	  
	  console.log('blink LED');
	  
	  var toggleSwitch = false;
	  iv = setInterval(function(){
			toggleSwitch = !toggleSwitch;
			if(toggleSwitch)
			{
				ivInternal = setInterval(function(){
					led.writeSync(led.readSync() ^ 1);
					}, 500);
			}else
			{
				clearInterval(ivInternal);
				led.writeSync(0);
			}
		},5000);
	}
};

exports.offLED =  function(){
	if(isStarted)
	{
	  console.log('release GPIO port :'+ GPIO_PORT);
	  
	  clearInterval(iv);
	  clearInterval(ivInternal);
	   
	  led.unexport();
	  led = null;
	  isStarted = false;
	}
};