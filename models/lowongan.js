'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lowongan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Lowongan.init({
    nama: DataTypes.STRING,
    lokasi: DataTypes.STRING,
    tgl_mulai: DataTypes.DATE,
    tgl_akhir: DataTypes.DATE,
    status: DataTypes.BOOLEAN,
    umkm_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Lowongan',
  });
  return Lowongan;
};