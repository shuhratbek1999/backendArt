const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ProjectBol', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    aftor_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    cart: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    aftor_img: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    extra_description:{
      type: DataTypes.TEXT,
      allowNull: false
    },
    date_time: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lang: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    doc_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'project_bol',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
