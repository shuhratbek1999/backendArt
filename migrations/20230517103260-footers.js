'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
       try{
        await queryInterface.createTable("footers", {
          id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
          },
          location:{
            type: Sequelize.STRING,
            allowNull: false
          },
          contact:{
            type: Sequelize.STRING,
            allowNull: false
          },
          email:{
            type: Sequelize.STRING,
            allowNull: false
          },
          founders:{
            type: Sequelize.STRING,
            allowNull: true
          },
          meneger:{
            type: Sequelize.STRING,
            allowNull: false
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
          await queryInterface.dropTable('footers', { transaction });
          
          transaction.commit();
        } catch (errors) {
          transaction.rollback();
          throw errors;
        }
      }
};
