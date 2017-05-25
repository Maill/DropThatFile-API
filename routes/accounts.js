'use strict';

var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.get('/setUserToken/:userId/:token', function(req, res){
    models.accounts.update(
        { idToken: req.params.token },
        { where : { id: req.params.userId } }
    ).then(function(result){
        res.send(result);
    }).catch(function(er){
        res.send(er);
    })
});

module.exports = router;