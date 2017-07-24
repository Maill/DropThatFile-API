'use strict';

var fs = require('fs');
var NodeRSA = require('node-rsa');
var crypto = require('crypto');

var RSAKeys = function RSAKeys(){
    var RSAObject;
    var strPrivKey;
    var strPubKey;
    var strPrivKeyDer;
    var strPubKeyDer;
    
    this.init = function(){
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
            RSAObject = keys;
        } else {
            keys = new NodeRSA({b: 2048});
            keys.importKey(Strpriv, 'pkcs1');
            RSAObject = keys;
        }
        strPrivKey = RSAObject.exportKey('private').replace(/-----BEGIN PRIVATE KEY-----/, '').replace(/-----END PRIVATE KEY-----/, '').replace(/\n/g, '');
        strPubKey = RSAObject.exportKey('public').replace(/-----BEGIN PUBLIC KEY-----/, '').replace(/-----END PUBLIC KEY-----/, '').replace(/\n/g, '');
        strPrivKeyDer = RSAObject.exportKey('private');
        strPubKeyDer = RSAObject.exportKey('public');
        RSAObject.setOptions({encryptionScheme: 'pkcs1'});
    }

    this.encrypt = function(message){
        return RSAObject.encrypt(message, "base64").toString();
    };

    this.decrypt = function(cryptedmessage){
        return RSAObject.decrypt(cryptedmessage).toString();
    };

    this.getPublicKey = function(){
        return strPubKey;
    };

    this.getPublicKeyDer = function(){
        return strPubKeyDer;
    };

    this.getPrivateKeyDer = function(){
        return strPrivKeyDer;
    };

    this.getPrivateKey = function(){
        return strPrivKey;
    };
 
    /*if(RSAKeys.caller != RSAKeys.getInstance){
        throw new Error("This object cannot be instanciated");
    }*/
}

RSAKeys.instance = null;
 
/**
 * Singleton getInstance definition
 * @return singleton class
 */
RSAKeys.getInstance = function(){
    if(this.instance === null){
        this.instance = new RSAKeys();
        this.instance.init();
    }
    return this.instance;
}
 
module.exports = RSAKeys.getInstance();

function writeKeysInFile(priv){
    fs.writeFileSync('./configuration/private.pem', priv);
}

/*function RSAKeys(){
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

RSAKeys.prototype.getPublicKeyDer = function(){
    var publicDer = this.RSAObject.exportKey('public');
    return publicDer;
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
}*/