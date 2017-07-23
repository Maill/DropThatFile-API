'use strict';

var models  = require('../models');
var Accounts = models.accounts;
var Groups = models.accounts;
var FilesOfAccount = models.filesofaccount;
var express = require('express');
var router  = express.Router();
var RSAKeys = require('../keys');
var jwt = require('jsonwebtoken');

// route de connexion
router.post('/login', function(req, res){
    let decryptor = new RSAKeys();
    decryptor.RSAObject.setOptions({encryptionScheme: 'pkcs1'});
    let jsonObjectLogin = JSON.parse(decryptor.decrypt(req.body.credentials));
    Accounts.find({
        where : {
            mail: jsonObjectLogin.email,
        }
    }).then(function(result){
        if(result){
            if(result.password){
                if(decryptor.decrypt(result.password) != jsonObjectLogin.password){
                    res.json({
                        success: "false",
                        message: "Error while authenticating. Maybe wrong credentials."
                    })
                } else {
                    let token = createToken(decryptor.getPrivateKeyDer(), result.id);
                    let user = JSON.stringify({
                        id: result.id,
                        fname: result.fname,
                        lname: result.lname,
                        mail: result.mail,
                        lastlogin: result.lastLogin,
                        isadmin: result.isadmin
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
                message: "Error while authenticating. Maybe wrong credentials."
            }))
        }
    })
});

// ajout d'un compte
router.post('/addAccount', function(req, res){
    let rsaKey = new RSAKeys();
    rsaKey.RSAObject.setOptions({encryptionScheme: 'pkcs1'});
    let jsonObjectAddAccount = JSON.parse(rsaKey.decrypt(req.body.dataUser));
    
    let fname = jsonObjectAddAccount.fname;
    let lname = jsonObjectAddAccount.lname;
    let mail = jsonObjectAddAccount.mail;
    let password = rsaKey.encrypt(jsonObjectAddAccount.password)
    let dateNow = new Date().getTime();
    Accounts.upsert({
        fname: fname,
        lname: lname,
        mail: mail,
        password: password,
        createdAt: dateNow,
        updatedAt: dateNow
    }).then(function (result) {
        res.json({
            success: true,
            message: "The account has been successfully created or updated if he already exists."
        });
    }).catch(function (err) {
        if (err) {
            res.json({
                success: false,
                message: "Unhandled error while creating the account."
            });
            throw err;
        }
    });
})

/**
 * Delete an account via its email
 */
router.post("/deleteAccount", function (req, res) {
    let rsaKey = new RSAKeys();
    rsaKey.RSAObject.setOptions({encryptionScheme: 'pkcs1'});
    let jsonObjectDeleteAccount = JSON.parse(rsaKey.decrypt(req.body.dataUser));
    let email = jsonObjectDeleteAccount.mail
    Accounts.destroy({
        where:
        {
            mail: email
        }
    }).then(function (result) {
        res.json({
            success: true,
            message: "Account successfully deleted."
        });
    }).catch(function (err) {
        if (err) {
            res.json({
                success: false,
                message: "Unhandled error while deleting the account."
            });
            throw err;
        }
    });
});

module.exports = router;

// création du token de connexion
function createToken(privateKey, idUser){
    var token = jwt.sign({ identityUser: idUser }, privateKey, { expiresIn: '12h' });
    return token;
}