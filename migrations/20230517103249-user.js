'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
       try{
        await queryInterface.createTable("user", {
          id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
          },
          name:{
            type: Sequelize.STRING,
            allowNull: false
          },
          password:{
            type: Sequelize.STRING,
            allowNull: false
          },
          token:{
            type: Sequelize.STRING
          },
          role:{
            type: Sequelize.ENUM('Admin','User','foydalanuvchi'),
            allowNull: false,
            defaultValue: 'foydalanuvchi'
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
          await queryInterface.dropTable('user', { transaction });
          
          transaction.commit();
        } catch (errors) {
          transaction.rollback();
          throw errors;
        }
      }
};
