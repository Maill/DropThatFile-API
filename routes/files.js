'use strict';

var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.post('/getFilesOfUser', function(req, res){
    //recupère tout les fichier de l'utilisateur
    //avoir comme données a la fin {userfiles:[{donnes_file, donnes_file}]}
})

router.post('/getFilesOfGroup', function(req, res){
    //recupère tout les fichier d'un groupe pour une liste de groupe donné
    //detail de la donnée du post : 2;3;5;7 <= id des groupes
    //avoir comme données a la fin {2:[{donnes_file, donnes_file}], 3:[{donnes_file, donnes_file}], etc...}
})


module.exports = router;