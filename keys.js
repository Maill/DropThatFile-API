'use strict';

var fs = require('fs');
var NodeRSA = require('node-rsa');
var crypto = require('crypto');

function RSAKeys(){
     this.RSAObject = initKeys();
}

RSAKeys.prototype.encrypt = function(message){
    return this.RSAObject.encrypt(message, "base64").toString();
};

RSAKeys.prototype.decrypt = function(cryptedmessage){
    return this.RSAObject.decrypt(cryptedmessage).toString();
};

RSAKeys.prototype.getPublicKey = function(){
    var publicDer = this.RSAObject.exportKey('public');
    return publicDer.replace(/-----BEGIN PUBLIC KEY-----/, '').replace(/-----END PUBLIC KEY-----/, '').replace(/\n/g, '');
};

RSAKeys.prototype.getPrivateKeyDer = function(){
    var privateDer = this.RSAObject.exportKey('private');
    return privateDer
};

RSAKeys.prototype.getPrivateKey = function(){
    var privateDer = this.RSAObject.exportKey('private');
    return privateDer.replace(/-----BEGIN PRIVATE KEY-----/, '').replace(/-----END PRIVATE KEY-----/, '').replace(/\n/g, '');
};
module.exports = RSAKeys;
// Méthodes privées

function initKeys(){
    //From file
    var Strpriv = '';
    //Objects
    var keys;

    Strpriv = fs.readFileSync('./configuration/private.pem').toString().trim();

    if(Strpriv.length == 0){
        keys = new NodeRSA({b: 2048});
        keys.generateKeyPair();
        var Strpriv = keys.exportKey('private');
        writeKeysInFile(Strpriv);
    } else {
        keys = new NodeRSA({b: 2048});
        keys.importKey(Strpriv, 'pkcs1');
    }
    return keys;
}

function writeKeysInFile(priv){
    fs.writeFileSync('./configuration/private.pem', priv);
}