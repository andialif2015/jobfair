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
    posisi: DataTypes.STRING,
    gaji: DataTypes.INTEGER,
    tgl_mulai: DataTypes.DATE,
    tgl_akhir: DataTypes.DATE,
    umkm_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Lowongan',
    tableName: 'lowongans',
  });
  return Lowongan;
};