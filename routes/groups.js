'use strict';

var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.get('/getUserGroups', function(req, res){
    models.membersof.findAll({
        where : {
            id_account: 1,
        },
        include : [{
            model: models.groups,
            as: "memberof"
        }],
        raw: true,
    }).then(function(result){
        if(result){
            console.log(result)
        } else {
            res.send(JSON.stringify({
                success: "false",
                message: "Error while retrieving groups for user."
            }))
        }
    })
});

module.exports = router;