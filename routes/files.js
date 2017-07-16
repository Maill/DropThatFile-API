'use strict';

var models  = require('../models');
var Accounts = models.accounts;
var Groups = models.groups;
var Files = models.files;
var FilesOfAccount = models.filesofaccount;
var FilesOfGroup = models.filesofgroup;
var express = require('express');
var router  = express.Router();
var jwt = require('jsonwebtoken');
var RSAKeys = require('../keys');

var decryptor = new RSAKeys();
decryptor.RSAObject.setOptions({encryptionScheme: 'pkcs1'});

router.post('/getFilesOfUser', function(req, res){
    Accounts.findAll({
        attributes: [],
        where : {
            id: jwt.verify(req.get('Authorization'), new RSAKeys().getPrivateKey()).identityUser
        },
        include : [{
            model: Files,
            as: 'userfiles',
            attributes: ['id', 'name', 'password', 'created', 'description']
        }]
    }).then(result => {
        res.json({result});
    }).catch(function (err) {
        if (err) {
            res.json({
                success: "false",
                message: "Error while retrieving files for user."
            });
            throw err;
        }
    });
})

router.post('/getFilesOfGroup', function(req, res){
    Groups.findAll({
        attributes: ['id'],
        where : {
            id: decryptor.decrypt(req.body.groupsList)
        },
        include : [{
            model: Files,
            as: 'groupfiles',
            attributes: ['id', 'name', 'password', 'created', 'description']
        }]
    }).then(result => {
        res.json({result});
    }).catch(function (err) {
        if (err) {
            res.json({
                success: "false",
                message: "Error while retrieving files for group."
            });
            throw err;
        }
    });
})


module.exports = router;