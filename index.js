var CryptoJS = require("crypto-js");
var request = require("request");
var async = require('async');

var API_KEY = "";
var SECRET_KEY = "";
var HOSTNAME = "";
var DOMAIN ="";

exports.handler = (event, context, callback) => {
  
      var messageBody = event.body;
      var roomName = event.talk;
      
      var ids = [];
      
      for(var name of messageBody.match(/(^|\W)(@[a-z\d][\w-]*)/ig)) {
        name = name.substring(name.indexOf("@") + 1, name.length) //一時的な修正
        ids.push(name);
      }
      
      async.mapSeries(ids, function(id, callback) {
    
        var jid = id + "@" + DOMAIN;

        var requestUri = "/api/1.0/talks/" + jid + "/messages";
        var url = "https://" + HOSTNAME + requestUri;
        var body = JSON.stringify({
            "body": "会議室 : [" + roomName + "] でメンションされました。\n\n"  + messageBody
        });

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
};
