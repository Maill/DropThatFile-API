/* jshint indent: 2 */
'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('configuration', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    server_private_key: {
      type: DataTypes.STRING(2048),
      allowNull: false
    },
    server_public_key: {
      type: DataTypes.STRING(2048),
      allowNull: true
    }
  }, {
    tableName: 'configuration'
  });
};
