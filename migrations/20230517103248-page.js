'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
       try{
        await queryInterface.createTable("page", {
          id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
          },
          name:{
            type: Sequelize.STRING,
            unique: true
          }
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
          await queryInterface.dropTable('page', { transaction });
          
          transaction.commit();
        } catch (errors) {
          transaction.rollback();
          throw errors;
        }
      }
};
