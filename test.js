var mqtt = require('./mqtt-wrapper.js')();
var sphero = require("sphero"),
    bb8 = sphero("699dc20f90214e4a809c60b94daea9c1"); // change BLE address accordingly



console.log("**** Start debug info *****");
console.log("Connected to BB-8");


mqtt.connect(function (client, deviceId) {
    client.on('connect', function () {
        console.log('MQTT client connected to IBM IoT Cloud.');
        console.log('Connected Sphero ID: ' + deviceId);
        client.subscribe('iot-2/cmd/run/fmt/json', {
            qos: 0
        }, function (err, granted) {
            if (err) {
                throw err;
            }
            console.log("subscribed to iot-2/cmd/run/fmt/json");
        });
    });

    client.on('message', function (topic, message, packet) {
        console.log(topic);
        var msg = JSON.parse(message.toString());
        console.log(msg);
        if (msg.d.action === '#red') {
            console.log('Change color to RED');
            bb8.color("red");

        } else if (msg.d.action === '#blue') {
            console.log('Change color to BLUE');
            bb8.color("blue");


        } else if (msg.d.action === '#start') {
                console.log('Start Sphero');
                    
                myDirection=msg.d.direction;
                if (myDirection<0){
                    myDirection= 360+msg.d.direction;
                }
            
                console.log('Direction: ' +  myDirection);
           
               
            }
           else if (msg.d.action === '#stop') {
                console.log('Stop Sphero');
                myDirection=msg.d.direction;
                if (myDirection<0){
                    myDirection= 360-msg.d.direction;
                }
            
                console.log('Direction: ' +  myDirection);
               
            } else if (msg.d.action === '#spherorun') {
            console.log('Get Sphero to run');
            bb8.roll(150, 0);
            setTimeout(function () {
                bb8.stop();
            }, 1500); //Stop after 1.5 seconds



            setInterval(function () {
                var newRed = Math.floor(Math.random() * 256);
                var newBlue = Math.floor(Math.random() * 256);
                var newGreen = Math.floor(Math.random() * 256);
                console.log("R: " + newRed + " G: " + newGreen + " B: " + newBlue);
                bb8.color({
                    red: newRed,
                    green: newGreen,
                    blue: newBlue
                });
            }, 1000); //change color every second
        }
    });
});