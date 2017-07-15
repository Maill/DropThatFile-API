'use strict';

var models  = require('../models');
var MembersOf = models.membersof;
var Accounts = models.accounts;
var Groups = models.groups;
var express = require('express');
var router  = express.Router();

router.get('/getUserGroups', function(req, res){
    Accounts.findAll({
        attributes: [],
        where : {
            id: 1,
        },
        include : [{
            model: Groups,
            as: 'memberof'
        }]
    }).then(result => {
        res.json(result);
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

module.exports = router;