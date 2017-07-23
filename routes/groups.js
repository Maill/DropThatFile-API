'use strict';

var models  = require('../models');
var MembersOf = models.membersof;
var Accounts = models.accounts;
var Groups = models.groups;
var express = require('express');
var router  = express.Router();
var jwt = require('jsonwebtoken');
var RSAKeys = require('../keys');
var NodeRSA = require('node-rsa');

// Récupération des groupes de l'utilisateur
router.post('/getUserGroups', function(req, res){
    Accounts.findAll({
        attributes: [],
        where : {
            id: jwt.verify(req.get('Authorization'), new RSAKeys().getPrivateKeyDer()).identityUser
        },
        include : [{
            model: Groups,
            as: 'memberof',
            attributes: ['id', 'name', 'public_key', 'createdAt', 'updatedAt']
        }]
    }).then(result => {
        res.json({result});
    }).catch(function (err) {
        if (err) {
            res.json({
                success: "false",
                message: "Error while retrieving groups for user."
            });
            throw err;
        }
    });
});

// Récupère le mot de passe pour ouvrir une archive de groupe
router.post('/getPasswordForFile', function(req, res){
    Groups.findAll({
        attributes: ['id'],
        where : {
            id: JSON.parse(decryptor.decrypt(req.body.GroupsList))
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
                message: "Error while retrieving files for groups."
            });
            throw err;
        }
    });
});

// Crée un groupe
router.post('/addGroup', function(req, res){
    let keys = new NodeRSA({b: 2048});
    let rsaKey = new RSAKeys();
    keys.generateKeyPair();
    keys.setOptions({encryptionScheme: 'pkcs1'});
    rsaKey.RSAObject.setOptions({encryptionScheme: 'pkcs1'});    
    let jsonObjectAddGroup = JSON.parse(rsaKey.decrypt(req.body.dataGroup));
        
    let name = jsonObjectAddGroup.name;
    let privateKey = keys.exportKey('private').replace(/-----BEGIN RSA PRIVATE KEY-----/, '').replace(/-----END RSA PRIVATE KEY-----/, '').replace(/\n/g, '');
    let publicKey = keys.exportKey('public').replace(/-----BEGIN PUBLIC KEY-----/, '').replace(/-----END PUBLIC KEY-----/, '').replace(/\n/g, '');
    let dateNow = new Date().getTime();
    Groups.upsert({
        name: name,
        private_key: privateKey,
        public_key: publicKey,
        updatedAt: dateNow,
        createdAt: dateNow
    }).then(function (result) {
        res.json({
            success: true,
            message: "The group has been successfully created or updated if he already exists."
        });
    }).catch(function (err) {
        if (err) {
            res.json({
                success: false,
                message: "Unhandled error while creating the group."
            });
            throw err;
        }
    });
});

/**
 * Delete a group via its name (unique)
 */
router.post("/deleteGroup", function (req, res) {
    let rsaKey = new RSAKeys();
    rsaKey.RSAObject.setOptions({encryptionScheme: 'pkcs1'});
    let jsonObjectDeleteGroup = JSON.parse(rsaKey.decrypt(req.body.dataGroup));
    let name = jsonObjectDeleteGroup.name
    Groups.destroy({
        where:
        {
            name: name
        }
    }).then(function (result) {
        res.json({
            success: true,
            message: "Group successfully deleted."
        });
    }).catch(function (err) {
        if (err) {
            res.json({
                success: false,
                message: "Unhandled error while deleting the group."
            });
            throw err;
        }
    });
});


module.exports = router;