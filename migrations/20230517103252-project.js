'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
       try{
        await queryInterface.createTable("project", {
          id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
          },
          category_id:{
            type: Sequelize.INTEGER,
            allowNull: false
          },
          name:{
            type: Sequelize.STRING,
            allowNull: false
          },
          aftor_name:{
            type: Sequelize.STRING,
            allowNull: false
          },
          aftor_img:{
            type: Sequelize.STRING,
            allowNull: true
          },
          description:{
            type: Sequelize.TEXT,
            allowNull: false
          },
          extra_description:{
            type: Sequelize.TEXT
          },
          date_time:{
            type: Sequelize.INTEGER,
            allowNull: false
          },
          user_id:{
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'user',
              key: 'id'
            },
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE'
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
          await queryInterface.dropTable('project', { transaction });
          
          transaction.commit();
        } catch (errors) {
          transaction.rollback();
          throw errors;
        }
      }
};
