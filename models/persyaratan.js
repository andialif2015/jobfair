'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Persyaratan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Persyaratan.init({
    jk: DataTypes.INTEGER,
    umur: DataTypes.INTEGER,
    domisili: DataTypes.STRING,
    keahlian: DataTypes.STRING,
    lainnya: DataTypes.TEXT,
    lowongan_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Persyaratan',
    tableName: 'persyaratans',
  });
  return Persyaratan;
};