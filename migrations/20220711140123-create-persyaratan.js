'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Persyaratans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      jk: {
        type: Sequelize.INTEGER
      },
      umur: {
        type: Sequelize.INTEGER
      },
      domisili: {
        type: Sequelize.STRING
      },
      keahlian: {
        type: Sequelize.STRING
      },
      lainnya: {
        type: Sequelize.TEXT
      },
      lowongan_id: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Persyaratans');
  }
};