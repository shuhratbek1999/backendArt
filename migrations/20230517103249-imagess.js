'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
       try{
        await queryInterface.createTable("imagess", {
          id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
          },
          url:{
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
          },
          doc_id:{
            type: Sequelize.INTEGER,
            allowNull: false
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
          await queryInterface.dropTable('imagess', { transaction });
          
          transaction.commit();
        } catch (errors) {
          transaction.rollback();
          throw errors;
        }
      }
};
