'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('user', [
      {
        "name": "Admin",
        "password": "$2a$08$PQvlFQA.H.nvfU.3qsRLqe.ZkF/.znI0/ZGsXbFFp0Rcsf9e0Hy3u",
        "role": "Admin"
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('user', null, {})
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
