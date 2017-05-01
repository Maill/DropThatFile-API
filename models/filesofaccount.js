/* jshint indent: 2 */
'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('filesofaccount', {
    id_account: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'accounts',
        key: 'id'
      }
    },
    id_files: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'files',
        key: 'id'
      }
    }
  }, {
    tableName: 'filesofaccount'
  });
};
