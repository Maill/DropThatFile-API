'use strict';

var models  = require('../models');
var RSAKeys = require('../keys');
var express = require('express');
var router  = express.Router();

//Permet d'obtenir un UUID servant de token de connexion 
/*router.get('/getGUID', function(req, res){
    models.sequelize.query("SELECT UUID()").then(function(data){
        res.setHeader("Content-Type", "application/json");
        var json = JSON.stringify({
            token: data[0][0]["UUID()"]
        }, null, 3)
        res.send(json);
    })
})*/

//Permet d'obtenir la clé publique RSA 2048 bit du serveur
router.post('/getServerPublicKey', function(req, res){
    var keys = new RSAKeys();
    res.setHeader("Content-Type", "application/json");
    res.json({
        server_public_key: keys.getPublicKey()
    });
})

module.exports = router;