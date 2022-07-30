'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Daftar_lowongan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Daftar_lowongan.init({
    umkm_id: DataTypes.INTEGER,
    lowongan_id: DataTypes.INTEGER,
    pelamar_id: DataTypes.INTEGER,
    waktu_daftar: DataTypes.DATE,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Daftar_lowongan',
    tableName: 'daftar_lowongans',
  });
  return Daftar_lowongan;
};