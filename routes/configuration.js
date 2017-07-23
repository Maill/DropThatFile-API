'use strict';

var models  = require('../models');
var RSAKeys = require('../keys');
var express = require('express');
var router  = express.Router();
var Client = require('ftp');
var fs = require('fs');
var NodeRSA = require('node-rsa');

//Permet d'obtenir la clé publique RSA 2048 bit du serveur
router.post('/getServerPublicKey', function(req, res){
    var keys = new RSAKeys();
    res.setHeader("Content-Type", "application/json");
    res.json({
        server_public_key: keys.getPublicKey(),
        server_public_key_der: keys.getPublicKeyDer()
    });
})

// Supprime le dossier FTP d'un groupe ou d'un utilisateur
// lorsque celui-ci est supprimé.
router.post('/deleteFTPFolder', function(req, res){
    var c = new Client();
    c.on('ready', function() {
        c.rmdir(req.body.path, true, function(err){
            c.end();
            if(err){
                throw err;
            }
        })
    });
    c.connect(JSON.parse(fs.readFileSync('./configuration/ftp.json').toString().trim()));
    res.json({
        success: true
    })
}) 

router.post('/getFTPCrendentials', function(req, res){
    var keys = new NodeRSA({b: 2048});
    keys.setOptions({encryptionScheme: 'pkcs1'});
    keys.importKey('-----BEGIN PUBLIC KEY----- MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApMlCIC7KlA1yGuYq5wVrJzsy+yDkqdQov8TM0DfBGJEK9xqxdXO8Gb2rHuotLkzx0f1bGWNQj5ZuRp6PqusT5dYUCvlEn9LxwXVWhfnP5gJq+Ews8uASwugN+6hLAkY01qFF+MMkLQeDpaddyiHoBYji4ci5aMKJrkjEy2i6eTqRd6lesPScz9UEwc4XJLoYyU8Qe37X9SeF4p1qFmUax3FSK4Kp+lz48phpM7y1VTWuzZ017yI4gvzjBLOtdiLem+aV28+JvYPJC1MLvxt+WADbo9sxfjvdpa7W+p77f7o07DKTlH+AjjilSjIOzxYoD/QkbspqaeVL7VHx5Gb+kwIDAQAB -----END PUBLIC KEY-----', 'public');
    res.json({
        ftpcredentials: keys.encrypt(fs.readFileSync('./configuration/ftp.json').toString().trim(), "base64")
    })
}) 

module.exports = router;