'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.sequelize.query(
        "ALTER TABLE `category` DROP INDEX IF EXISTS page_id",
        { transaction } // Transaction ni qo'shing
      );
      await transaction.commit(); // Transactionni qo'shing
    } catch (err) {
      await transaction.rollback(); // Transactionni qo'shing
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.changeColumn('category', 'page_id', {
        unique: true,
      }, { transaction }); // Transactionni qo'shing
      await transaction.commit(); // Transactionni qo'shing
    } catch (errors) {
      await transaction.rollback(); // Transactionni qo'shing
      throw errors;
    }
  }
};
