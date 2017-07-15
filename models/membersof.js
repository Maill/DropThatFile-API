/* jshint indent: 2 */
'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('membersof', {
    id_account: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'accounts',
        key: 'id'
      }
    },
    id_group: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'groups',
        key: 'id'
      }
    }
  }, {
    tableName: 'membersof'
  });
};
