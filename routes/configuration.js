'use strict';

var models  = require('../models');
var express = require('express');
var router  = express.Router();

//Permet d'obtenir un UUID servant de token de connexion 
router.get('/getGUID', function(req, res){
    models.sequelize.query("SELECT UUID()").then(function(data){
        res.setHeader("Content-Type", "application/json");
        var json = JSON.stringify({
            token: data[0][0]["UUID()"]
        }, null, 3)
        res.send(json);
    })
})

//Permet d'obtenir la clé publique RSA 2048 bit du serveur
router.get('/getServerPublicKey', function(req, res){
    models.configuration.find({
        attributes: ["server_public_key"],
        where: {
            id: 1
        }
    }).then(function(data){
        res.setHeader("Content-Type", "application/json");
        var json = JSON.stringify({
            server_public_key: data["server_public_key"]
        }, null, 3)
        res.send(json);
    })
})

module.exports = router;