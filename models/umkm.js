'use strict';
const path = require('path');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Umkm extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Umkm.init({
    user_id: DataTypes.INTEGER,
    nama_toko: DataTypes.STRING,
    jenis_usaha: DataTypes.STRING,
    tahun_berdiri: DataTypes.INTEGER,
    alamat: DataTypes.STRING,
    path: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Umkm',
    tableName: 'umkms',
  });
  return Umkm;
};