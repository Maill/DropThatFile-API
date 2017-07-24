'use strict';

var models  = require('../models');
var Accounts = models.accounts;
var Groups = models.groups;
var Files = models.files;
var FilesOfAccount = models.filesofaccount;
var FilesOfGroup = models.filesofgroup;
var express = require('express');
var router  = express.Router();
var jwt = require('jsonwebtoken');
var RSAKeys = require('../keys');

// Récupération des données des fichiers de l'utilisateur
router.post('/getFilesOfUser', function(req, res){
    Accounts.findAll({
        attributes: [],
        where : {
            id: jwt.verify(req.get('Authorization'), RSAKeys.getPrivateKeyDer()).identityUser
        },
        include : [{
            model: Files,
            as: 'userfiles',
            attributes: ['id', 'name', 'password', 'description']
        }]
    }).then(result => {
        res.json({result});
    }).catch(function (err) {
        if (err) {
            res.json({
                success: "false",
                message: "Error while retrieving Files for user."
            });
            throw err;
        }
    });
})

// Récupération des données des fichiers du groupe
router.post('/getFilesOfGroups', function(req, res){
    Groups.findAll({
        attributes: ['id'],
        where : {
            id: JSON.parse(RSAKeys.decrypt(req.body.groupsList))
        },
        include : [{
            model: Files,
            as: 'groupfiles',
            attributes: ['id', 'name', 'password', 'description']
        }]
    }).then(result => {
        res.json({result});
    }).catch(function (err) {
        if (err) {
            res.json({
                success: "false",
                message: "Error while retrieving Files for Groups."
            });
            throw err;
        }
    });
})

router.post('/accounts/addArchive', function(req, res){
    let jsonObjectAddFile = JSON.parse(RSAKeys.decrypt(req.body.dataFile).replace(/\[+/g, '').replace(/\]+/g, ''));
    let filePassword = req.body.passwordFile;
    let name = jsonObjectAddFile.name;
    let description = jsonObjectAddFile.description;
    let dateNow = new Date().toISOString().slice(0, 19).replace('T', ' '); // Convert Date format to MySQL Datetime format
    Files.upsert({
        name: name,
        password: filePassword,
        description: description,
        createdAt: dateNow,
        updatedAt: dateNow
    }).then(function (result) {
        return Files.find({
            attributes: ['id', 'description'],
            where : {
                name: name,
                description: description
            }
        }).then(function(insertedFileId){
            let jsonObjectInsertedFileId = JSON.stringify(insertedFileId);
            return FilesOfAccount.upsert({
                id_account: jwt.verify(req.get('Authorization'), RSAKeys.getPrivateKeyDer()).identityUser,
                id_files: JSON.parse(jsonObjectInsertedFileId).id
            }).then(function (result) {
                return res.json({
                    success: true,
                    message: "The archive has been successfully inserted or updated if it already exists in the table."
                });
            }).catch(function (err) {
                if (err) {
                    return res.json({
                        success: false,
                        message: "Error while adding the archive' association to the filesofaccount' table."
                    });
                    throw err;
                }
            });
        }).catch(function (err) {
            if (err) {
                return res.json({
                    success: false,
                    message: "Error while retrieving the archive from the Files' table."
                });
                throw err;
            }
        });
    }).catch(function (err) {
        if (err) {
            res.json({
                success: false,
                message: "Error while adding the archive to the Files' table."
            });
            throw err;
        }
    });
})

router.post('/accounts/addFile', function(req, res){  
    let jsonObjectAddFile = JSON.parse(RSAKeys.decrypt(req.body.dataFile));
    let filePassword = "N/A";
    let name = jsonObjectAddFile.name;
    let description = "N/A";
    let dateNow = new Date().toISOString().slice(0, 19).replace('T', ' '); // Convert Date format to MySQL Datetime format
    console.log(filePassword + "\n" + name + "\n" + description + "\n" + dateNow);
    Files.upsert({
        name: name,
        password: filePassword,
        description: description,
        createdAt: dateNow,
        updatedAt: dateNow
    }).then(function (result) {
        return Files.find({
            attributes: ['id', 'description'],
            where : {
                name: name,
                description: description
            }
        }).then(function(insertedFileId){
            let jsonObjectInsertedFileId = JSON.stringify(insertedFileId);
            return FilesOfAccount.upsert({
                id_account: jwt.verify(req.get('Authorization'), RSAKeys.getPrivateKeyDer()).identityUser,
                id_files: JSON.parse(jsonObjectInsertedFileId).id
            }).then(function (result) {
                return res.json({
                    success: true,
                    message: "The file has been successfully inserted or updated if it already exists in the table."
                });
            }).catch(function (err) {
                if (err) {
                    return res.json({
                        success: false,
                        message: "Error while adding the file' association to the filesofaccount' table."
                    });
                    throw err;
                }
            });
        }).catch(function (err) {
            if (err) {
                return res.json({
                    success: false,
                    message: "Error while retrieving the file from the Files' table."
                });
                throw err;
            }
        });
    }).catch(function (err) {
        if (err) {
            res.json({
                success: false,
                message: "Error while adding the file to the Files' table."
            });
            throw err;
        }
    });
})

router.post('/groups/addArchive', function(req, res){ 
    let jsonObjectAddFile = JSON.parse(RSAKeys.decrypt(req.body.dataFile));
    let jsonObjectGroupName = JSON.parse(RSAKeys.decrypt(req.body.dataGroup));
    let filePassword = req.body.passwordFile;
    let fileName = jsonObjectAddFile.name;
    let description = jsonObjectAddFile.description;
    let dateNow = new Date().toISOString().slice(0, 19).replace('T', ' '); // Convert Date format to MySQL Datetime format
    Files.upsert({
        name: fileName,
        password: filePassword,
        description: description,
        createdAt: dateNow,
        updatedAt: dateNow
    }).then(function (result) {
        return Files.find({
            attributes: ['id', 'description'],
            where : {
                name: fileName,
                description: description
            }
        }).then(function(insertedFileId){
            return Groups.find({
                attributes: ['id'],
                where : {
                    name: jsonObjectGroupName.name
                }
            }).then(function (foundGroupId) {
                let jsonObjectInsertedFileId = JSON.stringify(insertedFileId);
                let jsonObjectFoundGroupId = JSON.stringify(foundGroupId);
                return FilesOfGroup.upsert({
                    id_group: JSON.parse(jsonObjectFoundGroupId).id,
                    id_files: JSON.parse(jsonObjectInsertedFileId).id
                }).then(function (result) {
                    return res.json({
                        success: true,
                        message: "The file has been successfully inserted or updated if it already exists in the table."
                    });
                }).catch(function (err) {
                    if (err) {
                        return res.json({
                            success: false,
                            message: "Error while adding the file' association to the filesofaccount' table."
                        });
                        throw err;
                    }
                });
                return res.json({
                    success: true,
                    message: "The file has been successfully inserted or updated if it already exists in the table."
                });
            }).catch(function (err) {
                if (err) {
                    return res.json({
                        success: false,
                        message: "Error while adding the file' association to the filesofaccount' table."
                    });
                    throw err;
                }
            });
        }).catch(function (err) {
            if (err) {
                return res.json({
                    success: false,
                    message: "Error while retrieving the file from the Files' table."
                });
                throw err;
            }
        });
    }).catch(function (err) {
        if (err) {
            res.json({
                success: false,
                message: "Error while adding the file to the Files' table."
            });
            throw err;
        }
    });
})

router.post('/groups/addFile', function(req, res){    
    let jsonObjectAddFile = JSON.parse(RSAKeys.decrypt(req.body.dataFile));
    let jsonObjectGroupName = JSON.parse(RSAKeys.decrypt(req.body.dataGroup));
    let filePassword = "N/A";
    let fileName = jsonObjectAddFile.name;
    let description = jsonObjectAddFile.description;
    let dateNow = new Date().toISOString().slice(0, 19).replace('T', ' '); // Convert Date format to MySQL Datetime format
    Files.upsert({
        name: fileName,
        password: filePassword,
        description: description,
        createdAt: dateNow,
        updatedAt: dateNow
    }).then(function (result) {
        return Files.find({
            attributes: ['id', 'description'],
            where : {
                name: fileName,
                description: description
            }
        }).then(function(insertedFileId){
            return Groups.find({
                attributes: ['id'],
                where : {
                    name: jsonObjectGroupName.name
                }
            }).then(function (foundGroupId) {
                let jsonObjectInsertedFileId = JSON.stringify(insertedFileId);
                let jsonObjectFoundGroupId = JSON.stringify(foundGroupId);
                return FilesOfGroup.upsert({
                    id_group: JSON.parse(jsonObjectFoundGroupId).id,
                    id_files: JSON.parse(jsonObjectInsertedFileId).id
                }).then(function (result) {
                    return res.json({
                        success: true,
                        message: "The file has been successfully inserted or updated if it already exists in the table."
                    });
                }).catch(function (err) {
                    if (err) {
                        return res.json({
                            success: false,
                            message: "Error while adding the file' association to the filesofaccount' table."
                        });
                        throw err;
                    }
                });
                return res.json({
                    success: true,
                    message: "The file has been successfully inserted or updated if it already exists in the table."
                });
            }).catch(function (err) {
                if (err) {
                    return res.json({
                        success: false,
                        message: "Error while adding the file' association to the filesofaccount' table."
                    });
                    throw err;
                }
            });
        }).catch(function (err) {
            if (err) {
                return res.json({
                    success: false,
                    message: "Error while retrieving the file from the Files' table."
                });
                throw err;
            }
        });
    }).catch(function (err) {
        if (err) {
            res.json({
                success: false,
                message: "Error while adding the file to the Files' table."
            });
            throw err;
        }
    });
})

/**
 * Delete a file via its id
 */
router.post("/deleteFile", function (req, res) {
    let jsonObjectDeleteFile = JSON.parse(RSAKeys.decrypt(req.body.dataFile));

    let name = jsonObjectDeleteFile.name;
    let description = jsonObjectDeleteFile.description;
    Files.find({
        attributes: ['id', 'description'],
        where : {
            name: name,
            description: description
        }
    }).then(function(result1){
        return Files.destroy({
            where:
            {
                id: result1.dataValues.id,
                description: result1.dataValues.description
            }
        }).then(function (result2) {
            return res.json({
                success: true,
                message: "File successfully deleted."
            });
        }).catch(function (err) {
            if (err) {
                return res.json({
                    success: false,
                    message: "Unhandled error while deleting the file."
                });
                throw err;
            }
        });
    }).catch(function(err) {
        if (err) {
            res.json({
                success: false,
                message: "Unhandled error. The file probably does not exist in the database."
            });
            throw err;
        }
    });
});


module.exports = router;