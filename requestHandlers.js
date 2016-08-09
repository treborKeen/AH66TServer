var querystring = require("querystring");
var fs = require('fs');


function start(response, postData){
    console.log("Request handler 'start' was called.");

    var body = '<html>'+
        '<head>'+
        '<meta http-equiv="Content-Type" content = "text/html; '+
        'charset=UTF-8" />'+
        '</head>'+
        '</body>'+
        '<form action="/upload" method = "post">'+
        '<textarea name = "text" rows="20" cols = "60"></textarea>'+
        '<input type = "submit" value = "Submit text" />'+
        '</form>'+
        '</body>'+
        '</html>';
        response.writeHead(200,{"Content-Type":"text/html"});
        response.write(body);
        response.end();
}

function upload(response, postData){
    console.log("Request handler 'upload' was called.");
    response.writeHead(200,{"Content-Type":"text/plain"});
    response.write("You've sent the text: "+ 
        querystring.parse(postData).text);
    response.end();
}

function main(response, postData){
    console.log("Request handler 'main' was called.");
    fs.readFile('main.html',    // load html file

  function (err, data) {

    if (err) {

      response.writeHead(500);

      return response.end('Error loading index.html');

    }

    response.writeHead(200);

    response.end(data);

  });
}

function zone(response, postData){
    console.log("Request handler 'zone' was called.");
    fs.readFile('zone.html',    // load html file

  function (err, data) {

    if (err) {
      response.writeHead(500);
      return response.end('Error loading index.html');
    }
    response.writeHead(200);
    //response.write(data);
    response.end(data);

  });
}

function styles(response, postData){
    console.log("Request handler 'styles' was called.");
    fs.readFile(__dirname + '/public/css/styles.css',function(err,data){
        if(err) console.log(err);
        response.writeHead(200,{"Content-Type":"text/css"});
        response.write(data);
        response.end();
    });
}

function control(response, postData){
    console.log("Request handler 'control' was called.");
    fs.readFile(__dirname + '/public/js/control.js',function(err,data){
        if(err) console.log(err);
        response.writeHead(200,{"Content-Type":"text/javascript"});
        response.write(data);
        response.end();
    });
} 
function zoneControl(response, postData){
    console.log("Request handler 'zone control' was called.");
    fs.readFile(__dirname + '/public/js/zoneControl.js',function(err,data){
        if(err) console.log(err);
        response.writeHead(200,{"Content-Type":"text/javascript"});
        response.write(data);
        response.end();
    });
} 

function favicon(response, postData){
    console.log("Request handler 'favicon' was called.");
    fs.readFile(__dirname + '/public/images/favicon.ico',function(err,data){
        if(err) console.log(err);
        response.writeHead(200,{"Content-Type":"image/ico"});
        response.write(data);
        response.end();
    });
} 

function touchicon(response, postData){
    console.log("Request handler 'apple touch icon' was called.");
    fs.readFile(__dirname + '/public/images/Icon60@3x.png',function(err,data){
        if(err) console.log(err);
        response.writeHead(200,{"Content-Type":"image/png"});
        response.write(data);
        response.end();
    });
} 

exports.start=start;
exports.upload=upload;
exports.main=main;
exports.zone=zone;
exports.styles=styles;
exports.control=control;
exports.zoneControl=zoneControl;
exports.favicon=favicon;