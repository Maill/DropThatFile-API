//Definition des modules
var express = require('express')
var bodyParser = require('body-parser');
var http = require("http");
var fs = require('fs');
var jwt = require('jsonwebtoken');
var RSAKeys = require('./keys.js');
var NodeRSA = require('node-rsa');
var app = express();

// Relations
var models = require('./models');
var MembersOf = models.membersof;
var Accounts = models.accounts;
var Groups = models.groups;
var Files = models.files;
var FilesOfAccount = models.filesofaccount;
var FilesOfGroup = models.filesofgroup;

Accounts.belongsToMany(Groups, {
  through: MembersOf,
  foreignKey: 'id_account',
  otherKey: 'id_group',
  as: 'memberof',
  onDelete: 'CASCADE'
});

Accounts.belongsToMany(Files, {
  through: FilesOfAccount,
  foreignKey: 'id_account',
  otherKey: 'id_files',
  as: 'userfiles',
  onDelete: 'CASCADE'
});

Groups.belongsToMany(Files, {
  through: FilesOfGroup,
  foreignKey: 'id_group',
  otherKey: 'id_files',
  as: 'groupfiles',
  onDelete: 'CASCADE'
});

//Objets
var RSAOperation = new RSAKeys();
RSAOperation.RSAObject.setOptions({encryptionScheme: 'pkcs1'});

//MiddleWares
app.set('json spaces', 3);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//Définition des routes
var accounts = require ('./routes/accounts')
var files = require('./routes/files');
var groups = require('./routes/groups');
var configuration = require('./routes/configuration');

//MiddleWare token verification
app.use(function (req, res, next) {
  if (req.path.includes('configuration')) {
    next();
  } else if(req.path.includes('accounts/login')) {
    next();
  } else {
    var token = req.get('Authorization');
    var key = RSAOperation.getPrivateKeyDer();
    try {
      var decoded = jwt.verify(token, key);
      next();
    } catch (err) {
      res.json({
        message: "Invalid token."
      }, null, 3);
    }
  }
});

app.use('/accounts', accounts);
app.use('/files', files);
app.use('/groups', groups);
app.use('/configuration', configuration);

//Route racine
app.get('/', function (req, res) {
  res.json({
    message: "Welcome to the DropThatFile API. This entity is strictly reserved to the DropThatFile application."
  });
})

//
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
})