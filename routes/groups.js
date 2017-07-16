'use strict';

var models  = require('../models');
var MembersOf = models.membersof;
var Accounts = models.accounts;
var Groups = models.groups;
var express = require('express');
var router  = express.Router();
var jwt = require('jsonwebtoken');
var RSAKeys = require('../keys');

router.post('/getUserGroups', function(req, res){
    Accounts.findAll({
        attributes: [],
        where : {
            id: jwt.verify(req.get('Authorization'), new RSAKeys().getPrivateKey()).identityUser
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

router.post('/getPasswordForFile', function(req, res){
    
});


module.exports = router;