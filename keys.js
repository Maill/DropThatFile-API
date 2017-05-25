'use strict';

var fs = require('fs');
var NodeRSA = require('node-rsa');
var crypto = require('crypto');

function RSAkeys(){
     this.RSAObject = initKeys();
}

RSAkeys.prototype.crypt = function(message){
    return this.RSAObject.encrypt(message, "base64").toString();
};

RSAkeys.prototype.decrypt = function(cryptedmessage){
    return this.RSAObject.decrypt(cryptedmessage);
};

module.exports = RSAkeys;
// Méthode privées

function initKeys(){
    //From file
    var Strpriv = '';
    //Objects
    var keys;

    Strpriv = fs.readFileSync('./configuration/private.pem', (err, data) => {
        if(err) throw err;
    }).toString().trim();

    if(Strpriv.length == 0){
        keys = new NodeRSA({b: 2048});
        keys.generateKeyPair();
        var Strpriv = keys.exportKey('private');
    } else {
        keys = new NodeRSA({b: 2048});
        keys.importKey(Strpriv, 'pkcs1');
    }
    return keys;
}

function writeKeysInFile(pub, priv){
    fs.writeFileSync('./configuration/private.pem', priv, function(err){
        if(err) throw err;
    });
}