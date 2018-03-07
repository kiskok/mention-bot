var CryptoJS = require("crypto-js");
var request = require("request");
var async = require('async');

var API_KEY = process.env['apiKey'];
var SECRET_KEY = process.env['secretKey'];
var HOSTNAME = process.env['hostName'];
var hookRoomJid = process.env['hookRoomJid'];
var userJid = process.env['userJid'];

exports.handler = (event, context, callback) => {
   // module.exports = function(robot) {  //hubot用
    //     robot.hear(/(^|\W)(@[a-z\d][\w-]*)/ig, function(msg){
      
    var messageBody = event.body;
    var roomName = event.talk;
    var speaker = event.speaker;
    var talkJid = event.talkJid;
    
    if (talkJid == hookRoomJid) {
      context.done();
    }
    
    var ids = [];
    for(var name of messageBody.match(/(^|\W)(@[a-z\d][\w-]*)/ig)) {
        name = name.substring(name.indexOf("@") + 1, name.length)
        ids.push(name + "@" + userJid);
    }
    
    ids.push(hookRoomJid);
      
      async.each(ids, function(id, callback) {
        
        var requestUri = "/api/1.0/talks/" + id + "/messages";
        var url = "https://" + HOSTNAME + requestUri;
        
        var body;
        
        if (id == hookRoomJid) {
          body = JSON.stringify({
              "body": "トーク名 : [" + roomName + "] でメンションされました。\n\n"  + messageBody + "\n\n発言者 : " + speaker
          });
        } else {
          body = JSON.stringify({
              "body": "トーク名 : [" + roomName + "] でメンションされました。\n\n"  + messageBody
          });
        }

        var contentType = "application/json";
        var timestamp = (new Date()).toISOString();
    
        var signatureBase = url + "\n" +
            API_KEY + "\n" +
            timestamp + "\n" +
            body;
      
        var hash = CryptoJS.HmacSHA256(signatureBase, SECRET_KEY);
        var signature = CryptoJS.enc.Base64.stringify(hash);
      
        var headers = {
          'Content-Type': contentType,
          'x-lakeel-api-key': API_KEY,
          'x-lakeel-timestamp': timestamp,
          'x-lakeel-signature': signature
        }
      
        var request = require('request');
        var options = {
          uri: url,
          headers: headers,
          body: body
        };

        console.log(id);
        
        request.post(options,callback);
        
    }, function(err, res) {
      if (err == null) {
        
      }
      context.done();

    });
    // });
};
