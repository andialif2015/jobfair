'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Trx_klik extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Trx_klik.init({
    lowongan_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    jumlah_klik: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Trx_klik',
    tableName: 'trx_kliks'
  });
  return Trx_klik;
};