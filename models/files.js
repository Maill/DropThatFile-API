/* jshint indent: 2 */
'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('files', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(2048),
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(512),
      allowNull: true
    }
  }, {
    tableName: 'files'
  });
};
