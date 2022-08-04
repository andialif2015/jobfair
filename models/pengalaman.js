'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pengalaman extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Pengalaman.init({
    user_id: DataTypes.INTEGER,
    posisi: DataTypes.STRING,
    nama_perusahaan: DataTypes.STRING,
    jenis_usaha: DataTypes.STRING,
    tahun: DataTypes.INTEGER,
    lokasi: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Pengalaman',
  });
  return Pengalaman;
};