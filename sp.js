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

function start(ser) {

io = require('socket.io').listen(ser);


 sp.on("open", function () {
    console.log('open');
    sp.on('data',processData);
 })
 
 io.sockets.on('connection', function (socket) {

  // listen to sockets
  // Get current vol levels
 
  for(i=1;i<13;i++){
    sp.write('&AH66,ZQRY,'+i+',?\r')}
 
  sp.write('&AH66,R1,TUNE,?\r')
  sp.write('&AH66,R2,TUNE,?\r')
  
  setTimeout(function() {
      
      console.log('tuners are :' + tuners);
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
}
   
   


/*function handler (req, res) {

  if (req.url == "/favicon.ico"){   // handle requests for favico.ico

  res.writeHead(200, {'Content-Type': 'image/x-icon'} );

  res.end();

  console.log('favicon requested');

  return;

  } 

  fs.readFile('Html1.html',    // load html file

  function (err, data) {

    if (err) {

      res.writeHead(500);

      return res.end('Error loading index.html');

    }

    res.writeHead(200);

    res.end(data);

  });

} 
*/




/*
// Get server IP address on LAN

function getIPAddress() {

  var interfaces = require('os').networkInterfaces();

  for (var devName in interfaces) {

    var iface = interfaces[devName];

    for (var i = 0; i < iface.length; i++) {

      var alias = iface[i];

      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)

        return alias.address;

    }

  }

  return '0.0.0.0';
} */

exports.start = start;
