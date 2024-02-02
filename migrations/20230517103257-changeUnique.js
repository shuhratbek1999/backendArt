'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
       try{
        await queryInterface.sequelize.query(
          'ALTER TABLE category DROP INDEX IF EXISTS page_id',
          {
            type: Sequelize.QueryTypes.UPDATE
          }
        );
        transaction.commit()
       }
       catch(err){
         transaction.rollback();
         throw err;
       }
      },

      async down (queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
          await queryInterface.changeColumn('category', 'page_id', {
            unique: true
         })
          transaction.commit();
        } catch (errors) {
          transaction.rollback();
          throw errors;
        }
      }
};
