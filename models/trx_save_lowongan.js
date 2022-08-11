'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Trx_save_lowongan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Trx_save_lowongan.init({
    pelamar_id: DataTypes.INTEGER,
    lowongan_id: DataTypes.INTEGER,
    umkm_id: DataTypes.INTEGER,
    saved: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Trx_save_lowongan',
    tableName: 'trx_save_lowongans',
  });
  return Trx_save_lowongan;
};