const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Url', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    insta_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    facebook_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    you_tube_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    sayt_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    doc_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'url',
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
