var fs = require('fs');

var b = require('bonescript');

var SerialPort = require("serialport").SerialPort;
var serialport = require("serialport");
var sp = new SerialPort("/dev/ttyO4", {
    baudrate: 115200,
    parser: serialport.parsers.readline("\r")
 });
 
var io;
var tuners=[];
var zData=[[]];  //note nested arrays not 2d declaration
var curZone=1;
var doorbell=0;

function start(ser) {

io = require('socket.io').listen(ser);


 sp.on("open", function () {
    console.log('open');
    sp.on('data',processData);
    setInterval(function(){
      sp.write("&AH66,STI,1,?\r");
    },1000)
 })
 
 io.sockets.on('connection', function (socket) {

  // listen to sockets
  // Get current vol levels
 
  for(i=1;i<7;i++){
    sp.write('&AH66,ZQRY,'+i+',?\r')}
 
  sp.write('&AH66,R1,TUNE,?\r')
  //sp.write('&AH66,R2,TUNE,?\r')
  
  setTimeout(function() {
      
      //console.log('tuners are :' + tuners);
      //console.log('zone data :' +zData);
      //console.log('zData 1,1 :  '+zData[1][1]);
      socket.emit('update', tuners, zData,curZone);
    }, 500 );
    
  socket.on('zvol', function (zone, data) {

    console.log('zone: '+zone+'  level: '+data);
    sp.write("&AH66,VOL,"+zone+','+data+"\r");
  });
  
  
  socket.on('zoneSelect', function(zone, data) {
  
    console.log("Audio for: " + zone + ' with value ' + data);
    if (data[0] == 'R') {
      sp.write("&AH66,AUD," + zone + ',' + data + "\r");
    }
    else {
      sp.write("&AH66,AUD," + zone + ',' + data.substring(1) + "\r");
    }
  
  });
  socket.on('trebelSelect', function(zone, data) {
  
    console.log("Trebel for: " + zone + ' with value ' + data);
     if(data >0)
      sp.write("&AH66,TRE," + zone  + ',' + '+' + ','+Math.abs(data)+"\r");
    else if(data < 0)
      sp.write("&AH66,TRE," + zone  + ',' + '-' + ','+Math.abs(data)+"\r");
    else
      sp.write("&AH66,TRE," + zone  + ',' + ','+data+"\r");
    
  
  });
  socket.on('bassSelect', function(zone, data) {
  
    console.log("Bass for: " + zone + ' with value ' + data);
    if(data >0)
      sp.write("&AH66,BAS," + zone  + ',' + '+' + ','+Math.abs(data)+"\r");
    else if(data < 0)
      sp.write("&AH66,BAS," + zone  + ',' + '-' + ','+Math.abs(data)+"\r");
    else
      sp.write("&AH66,BAS," + zone  + ',' + ','+data+"\r");
  });
  
  socket.on('updateZone', function (data) {
  curZone=data;
    console.log('zone selected: '+data);
    sp.write('&AH66,ZQRY,'+data+',?\r');
    
 });
 
  socket.on('page', function (data) {

    console.log("Page: "+' with value '+ data);
    sp.write("&AH66,PG,0,"+data+"\r");
  });
  
  socket.on('tune', function (tuner, data) {

    console.log("Tuner: "+ tuner+' with value '+ data);
    sp.write('&AH66,'+tuner+',TUNE,'+data+"\r");
  });
  
  socket.on('sysOff', function () {

    console.log("All Off");
    sp.write('&AH66,SYSOFF\r');
  });

});//end io.socket.on
} //end start

function processData(data) {
    console.log('data received: ' + data.toString());
    var dataSplit = data.split(',');
    //console.log(dataSplit);
    if (dataSplit[1] == 'ZQRY')
      zData[dataSplit[2]] = dataSplit.slice(3);
   
    if (dataSplit[2] == 'TUNE') {
      if (dataSplit[1] == 'R1')
        tuners[0] = dataSplit[3];
      else if(dataSplit[1] == 'R2')
        tuners[1] = dataSplit[3];
    }
   if (dataSplit[1] == 'STI') {
     //console.log('found sti');
      if (!doorbell&& dataSplit[3] == '100000')
      {
        doorbell=1;
        playDoorbell();
      }
    }
}   
   
function playDoorbell() {
 
        sp.write("&AH66,DB,1\r")
        setTimeout(function(){
          sp.write("&AH66,DB,0\r");
          doorbell=0;
        },10000)
}

exports.start = start;
