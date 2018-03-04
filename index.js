var CryptoJS = require("crypto-js");
var request = require("request");
var async = require('async');

var API_KEY = "";
var SECRET_KEY = "";
var HOSTNAME = "";

//exports.handler = (event, context, callback) => {
  module.exports = function(robot) {
    robot.hear(/(^|\W)(@[a-z\d][\w-]*)/ig, function(msg){
  
      var ids = ["okamoto-ke","sekine-mo"];

      async.mapSeries(ids, function(id, callback) {
        

        var jid = id + "@" + HOSTNAME;

        var requestUri = "/api/1.0/talks/" + jid + "/messages";
        var url = "https://" + HOSTNAME + requestUri;
        var body = JSON.stringify({
            "body": "heeeee"
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
     // context.done();

    });

  });
};
