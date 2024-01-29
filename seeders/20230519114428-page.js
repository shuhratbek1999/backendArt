'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('page', [
      {
        "name": "Projects"
      },
      {
        "name": "Visual Arts"
      },
      {
        "name": "Live Arts"
      },
      {
        "name": "Education"
      },
      {
        "name": "Screenings"
      },
      {
        "name": "Publications"
      },
      {
        "name": "Media"
      },
      {
        "name": "News"
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
