var Gpio = require('onoff').Gpio;
var button = null;
var GPIO_PORT = 22;
exports.buzzer = null;

var isWatching = false;
exports.watch = function(buzzer){
	console.log('Watching for any events on button at GPIO port:'+GPIO_PORT);
	
	if(!isWatching)
	{
		button = new Gpio(GPIO_PORT, 'in', 'both'); // and #27
		button.watch(function(err, value) {
		  if (err) exit();
		  console.log('Button activity. value :'+ value);
		  if(value == 1)
			buzzer.offBuzzer();
		});
		isWatching = true;
	}
};

exports.stop = function()
{
	if(isWatching)
	{
		button.unexport();
		button = null;
		isWatching = false;
	}
}
