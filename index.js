//Definition des modules
var express = require('express')
var bodyParser = require('body-parser');
var http = require("http");
var fs = require('fs');
var RSAKeys = require('./keys.js');
var NodeRSA = require('node-rsa');
var app = express()

//MiddleWares
app.set('json spaces', 3);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//Définition des routes
var accounts = require ('./routes/accounts')
var files = require('./routes/files');
var groups = require('./routes/groups');
var configuration = require('./routes/configuration');

app.use('/accounts', accounts);
//app.use('/files', files);
//app.use('/groups', groups);
app.use('/configuration', configuration);

//Route racine
app.get('/', function (req, res) {
  res.setHeader("Content-Type", "application/json");
  var json = JSON.stringify({ 
    message: "Welcome to the DropThatFile API. This entity is strictly reserved to the DropThatFile application.", 
  }, null, 3);
  res.send(json);
})

//
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
  var test = new RSAKeys();
  var encrypted = test.crypt("Je veux aller jouer a Rocket League.")
  console.log("Crypté : " + encrypted);
  var decrypted = test.decrypt(encrypted);
  console.log("Décrypté : " + decrypted);
})