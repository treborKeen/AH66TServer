var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");
var serport = require("./sp");
//var io = require('socket.io');

var handle = {};
handle["/"] = requestHandlers.main;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/main"] = requestHandlers.main;
handle["/public/css/styles.css"]=requestHandlers.styles;
handle["/public/js/control.js"]=requestHandlers.control;
handle["/public/images/favicon.ico"]=requestHandlers.favicon;

var serv = server.start(router.route, handle);
serport.start(serv);