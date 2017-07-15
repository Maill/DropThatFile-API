'use strict';

var models  = require('../models');
var express = require('express');
var RSAKeys = require('../keys');
var jwt = require('jsonwebtoken');
var router  = express.Router();

router.post('/login', function(req, res){
    var decryptor = new RSAKeys();
    decryptor.RSAObject.setOptions({encryptionScheme: 'pkcs1'});
    var jsonObjectLogin = JSON.parse(decryptor.decrypt(req.body.credentials));
    models.accounts.find({
        where : {
            mail: jsonObjectLogin.email,
        }
    }).then(function(result){
        if(result){
            if(result.password){
                if(decryptor.decrypt(result.password) != jsonObjectLogin.password){
                    res.send(JSON.stringify({
                        success: "false",
                        message: "Error while authenticating. Maybe wrong account or password."
                    }))
                } else {
                    var token = createToken(decryptor.getPrivateKey(), result.id);
                    var user = JSON.stringify({
                        id: result.id,
                        fname: result.fname,
                        lname: result.lname,
                        mail: result.mail,
                        lastlogin: result.lastLogin
                    })
                    res.json({
                        token: token,
                        user: user
                    });            
                }
            }
        } else {
            res.send(JSON.stringify({
                success: "false",
                message: "Error while authenticating. Maybe wrong account or password."
            }))
        }
    })
});

module.exports = router;

function createToken(privateKey, idUser){
    var token = jwt.sign({ identityUser: idUser }, privateKey, { expiresIn: '12h' });
    return token;
}