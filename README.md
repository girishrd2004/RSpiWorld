# RSpiWorld

I will be uploading the sample projects I create on RaspberryPi using Nodejs

## App1
Application to connect GREEN and RED LEDs on RaspberryPi Model 3 B. And operate them based on the MQTT message. 

This application will help your wife know if you are busy in office or free. 

Future enhacements will include buttons for wife to send text message as 'Call me Back' or 'I am not in home'

###How to use?

* Make sure the LEDs are connected to the given ports on RSPi (from the source, GPIO Port 18 and 25)
* Download the project
* Run npm install (Installs required node modules, note that onoff module require python to be installed on the given RSPi OS you are using)
* Run npm start (the application will start listening to messages on a given topic)

Send messages to MQTT topic referring to : https://www.npmjs.com/package/mqtt

See the LEDs blinking either when you are busy or free.

