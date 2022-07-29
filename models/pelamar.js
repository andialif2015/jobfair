'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pelamar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Pelamar.init({
    user_id: DataTypes.INTEGER,
    nama_lengkap: DataTypes.STRING,
    jk: DataTypes.STRING,
    tgl_lahir: DataTypes.DATEONLY,
    kota: DataTypes.STRING,
    tempat_tinggal: DataTypes.STRING,
    status: DataTypes.STRING,
    img_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Pelamar',
  });
  return Pelamar;
};