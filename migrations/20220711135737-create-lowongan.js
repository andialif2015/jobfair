'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Lowongans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      posisi: {
        type: Sequelize.STRING
      },
      gaji: {
        type: Sequelize.INTEGER
      },
      tgl_mulai: {
        type: Sequelize.DATE
      },
      tgl_akhir: {
        type: Sequelize.DATE
      },
      umkm_id: {
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
    await queryInterface.dropTable('Lowongans');
  }
};