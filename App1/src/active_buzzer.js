var Gpio = require('onoff').Gpio;
var activeBuzzer = null;
var GPIO_PORT = 23;
var isStarted = false;

var iv = null;
var ivInternal = null;

exports.onBuzzer = function(){
	if(!isStarted)
	{
	  console.log('export GPIO port : '+ GPIO_PORT);
	  
	  activeBuzzer = new Gpio(GPIO_PORT, 'out');
	  activeBuzzer.writeSync(0);
	  isStarted = true;
	  
	  console.log('Buzz...');
	  
	  var toggleSwitch = false;
	  iv = setInterval(function(){
			toggleSwitch = !toggleSwitch;
			if(toggleSwitch)
			{
				ivInternal = setInterval(function(){
					activeBuzzer.writeSync(activeBuzzer.readSync() ^ 1);
					}, 500);
			}else
			{
				clearInterval(ivInternal);
				activeBuzzer.writeSync(0);
			}
		},5000);
	}
};

exports.offBuzzer =  function(){
	if(isStarted)
	{
	  console.log('release GPIO port :'+ GPIO_PORT);
	  
	  clearInterval(iv);
	  clearInterval(ivInternal);
	  activeBuzzer.writeSync(1);
	  activeBuzzer.unexport();
	  activeBuzzer = null;
	  isStarted = false;
	}
};