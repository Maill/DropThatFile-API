/* jshint indent: 2 */
'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('groups', {
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
    private_key: {
      type: DataTypes.STRING(2048),
      allowNull: false
    },
    public_key: {
      type: DataTypes.STRING(2048),
      allowNull: false
    }
  }, {
    tableName: 'groups'
  });
};
