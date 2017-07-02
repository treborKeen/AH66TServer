//Copy of index in autorun
var server = require("../AH66TServer/server");
var router = require("../AH66TServer/router");
var requestHandlers = require("../AH66TServer/requestHandlers");
var serport = require("../AH66TServer/sp");
//var io = require('socket.io');

var handle = {};
handle["/"] = requestHandlers.main;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/main"] = requestHandlers.main;
handle["/zone"] = requestHandlers.zone;
handle["/public/css/styles.css"]=requestHandlers.styles;
handle["/public/js/control.js"]=requestHandlers.control;
handle["/public/js/zoneControl.js"]=requestHandlers.zoneControl;
handle["/public/images/favicon.ico"]=requestHandlers.favicon;
handle["/favicon.ico"]=requestHandlers.favicon;
handle["/apple-touch-icon.png"]=requestHandlers.favicon;

var serv = server.start(router.route, handle);
serport.start(serv);