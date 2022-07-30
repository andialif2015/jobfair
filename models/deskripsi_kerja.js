'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Deskripsi_kerja extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Deskripsi_kerja.init({
    deskripsi: DataTypes.TEXT,
    lowongan_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Deskripsi_kerja',
    tableName: 'deskripsi_kerjas',
  });
  return Deskripsi_kerja;
};