'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
       try{
        await queryInterface.addColumn('category', 'titles',{
            type: Sequelize.STRING,
            allowNull: false
        }, {transaction}
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
          await queryInterface.removeColumn('category', 'titles', { transaction });
          
          transaction.commit();
        } catch (errors) {
          transaction.rollback();
          throw errors;
        }
      }
};
