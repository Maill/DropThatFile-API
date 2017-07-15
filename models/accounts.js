/* jshint indent: 2 */
'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('accounts', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    fname: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    lname: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    mail: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(2048),
      allowNull: false
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'accounts'
  });
};
