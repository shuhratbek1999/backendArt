'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
       try{
        await queryInterface.createTable("urls", {
          id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
          },
          name:{
            type: Sequelize.STRING
          },
          link:{
            type: Sequelize.STRING
          },
          type:{
            type: Sequelize.STRING
          },
          color:{
            type: Sequelize.STRING
          },
          doc_id:{
            type: Sequelize.INTEGER
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
          await queryInterface.dropTable('urls', { transaction });
          
          transaction.commit();
        } catch (errors) {
          transaction.rollback();
          throw errors;
        }
      }
};
