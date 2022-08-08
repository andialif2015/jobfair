'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Trx_save_lowongans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pelamar_id: {
        type: Sequelize.INTEGER
      },
      lowongan_id: {
        type: Sequelize.INTEGER
      },
      umkm_id: {
        type: Sequelize.INTEGER
      },
      saved: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('Trx_save_lowongans');
  }
};