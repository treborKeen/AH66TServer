//ls /sys/devices/platform/ocp/ | grep pinmux*
//config-pin 'P9.11' uart
//config-pin 'P9.13' uart
//var fs = require('fs');

var b = require('bonescript');

const SerialPort = require("serialport");
//const serialport = require("serialport");
const Readline = SerialPort.parsers.Readline;
const port = new SerialPort("/dev/ttyO4", {
  baudRate: 115200
});
const parser = port.pipe(new Readline({ delimiter: '\r' }));

var io;
var tuners = [];
var zData = [[]]; //note nested arrays not 2d declaration
var curZone = 1;
var doorbellOn = 0;
var mdf = "Click to update song info";


b.pinMode('P8_7', b.INPUT);

function start(ser) {

  io = require('socket.io').listen(ser);


  port.on('open', function() {
    console.log('open');
    parser.on('data', processData);
    setInterval(function() {
      b.digitalRead('P8_7', function(err, x) {
        if (err) throw err;
        //console.log("read pin 8_7: "+x);
        if (x && !doorbellOn) {
          doorbellOn = 1;
          playDoorbell();
        }
        if (!x && doorbellOn) {
          doorbellOn = 0;
          stopDoorbell();
        }
      });
    }, 1000);
  });

  io.sockets.on('connection', function(socket) {

    // listen to sockets
    // Get current vol levels

    for (var i = 1; i < 10; i++) {
      port.write('&AH66,ZQRY,' + i + ',?\r');
    }

    port.write('&AH66,R1,TUNE,?\r');
    //sp.write('&AH66,R2,TUNE,?\r')

    setTimeout(function() {

      console.log('tuners are :' + tuners);
      console.log('zone data :' + zData);
      //console.log('zData 1,1 :  '+zData[1][1]);
      socket.emit('update', tuners, zData, curZone, mdf);
    }, 500);

    socket.on('zvol', function(zone, data) {

      console.log('zone: ' + zone + '  level: ' + data);
      port.write("&AH66,VOL," + zone + ',' + data + "\r");
    });


    socket.on('zoneSelect', function(zone, data) {

      console.log("Audio for: " + zone + ' with value ' + data);
      if (data[0] == 'R') {
        port.write("&AH66,AUD," + zone + ',' + data + "\r");
      }
      else {
        port.write("&AH66,AUD," + zone + ',' + data.substring(1) + "\r");
      }

    });
    socket.on('trebelSelect', function(zone, data) {

      console.log("Trebel for: " + zone + ' with value ' + data);
      if (data > 0)
        port.write("&AH66,TRE," + zone + ',' + '+' + ',' + Math.abs(data) + "\r");
      else if (data < 0)
        port.write("&AH66,TRE," + zone + ',' + '-' + ',' + Math.abs(data) + "\r");
      else
        port.write("&AH66,TRE," + zone + ',' + ',' + data + "\r");


    });
    socket.on('bassSelect', function(zone, data) {

      console.log("Bass for: " + zone + ' with value ' + data);
      if (data > 0)
        port.write("&AH66,BAS," + zone + ',' + '+' + ',' + Math.abs(data) + "\r");
      else if (data < 0)
        port.write("&AH66,BAS," + zone + ',' + '-' + ',' + Math.abs(data) + "\r");
      else
        port.write("&AH66,BAS," + zone + ',' + ',' + data + "\r");
    });

    socket.on('updateZone', function(data) {
      curZone = data;
      console.log('zone selected: ' + data);
      port.write('&AH66,ZQRY,' + data + ',?\r');

    });

    socket.on('page', function(data) {

      console.log("Page: " + ' with value ' + data);
      port.write("&AH66,PG,0," + data + "\r");
    });

    socket.on('tune', function(tuner, data) {

      console.log("Tuner: " + tuner + ' with value ' + data);
      port.write('&AH66,' + tuner + ',TUNE,' + data + "\r");
    });

    socket.on('sysOff', function() {

      console.log("All Off");
      port.write('&AH66,SYSOFF\r');
    });
    socket.on('updateMdf', function() {
      console.log("updateMdf");
      socket.emit('update', tuners, zData, curZone, mdf);
    });

  }); //end io.socket.on
} //end start

function processData(data) {
  console.log('data received: ' + data.toString());
  console.log((new Date()).toLocaleString("en-US", {timeZone: "America/Chicago"}));
  var dataSplit = data.toString().split(',');
  //console.log(dataSplit);
  if (dataSplit[1] == 'ZQRY')
    zData[dataSplit[2]] = dataSplit.slice(3);

  if (dataSplit[2] == 'TUNE') {
    if (dataSplit[1] == 'R1')
      tuners[0] = dataSplit[3];
    else if (dataSplit[1] == 'R2')
      tuners[1] = dataSplit[3];
  }
  if (dataSplit[2] == 'MDF' && dataSplit[3] == 'R') {
    var temp = "";
    if (dataSplit[4].length > 0) {
      for (var i = 4; i < dataSplit.length; i++) {
        temp = temp + dataSplit[i];
      }
      mdf = temp;
    }
    else{mdf="Click to update song info";}
  }

} //end processData

function playDoorbell() {
  console.log('playing doorbell ')
  console.log((new Date()).toLocaleString("en-US", {timeZone: "America/Chicago"}));
  port.write("&AH66,DB,1\r");
  /*setTimeout(function(){
    sp.write("&AH66,DB,0\r");
    //doorbell=0;
  },10000);*/
}

function stopDoorbell() {
  console.log('stopping doorbell');
  port.write("&AH66,DB,0\r");
}

exports.start = start;
