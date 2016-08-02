# RSpiWorld

I will be uploading the sample projects I create on RaspberryPi using Nodejs

## WifeIsPi
An off-mobile way of communicating with wife/mom/others in home when you are away (mostly in office)

### Features
This application is set on RaspberryPi Model 3 B using 
  * 74HC595N 8-bit shift register
  * Green/Red LEDs
  * An active buzzer
  * Two buttons
Software
  * NodeJS for programming
  * iot.eclipse.org MQTT broker for communication.

Future enhacements will include buttons for wife to send text message as 'Call me Back' or 'I am not in home'

###How to use?

* Make sure all the hardware devices are connected to the given set of ports on RSPi
* I am using GPIO Port :
  * 18 - DS 74HC595N
  * 24 - Clock for 74HC595N(ST_CP)
  * 25 - Latch for 74HC595N(SH_CP)
  * 22 - Button to stop buzzer
  * 23 - Active buzzer input
  
* Download the project
* Run npm install (Installs required node modules, note that onoff module require python to be installed on the given RSPi OS you are using)
* Run npm start (the application will start listening to messages on a given topic)

Send messages to MQTT topic referring to : https://www.npmjs.com/package/mqtt

Messages and corresponding actions : 

* 'IamFree' - Will set Green LEDs to pattern on/off from 1 to 4 after every 5 seconds
* 'IamBusy' - Will set Red LEDs to pattern on/off from 1 to 4 after every 5 seconds
* 'AlertWife' - Will set the active buzzer on until button isn't pressed to turn off


