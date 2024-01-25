var DataTypes = require("sequelize").DataTypes;
const sequelize = require('../src/db/db-sequelize')
var _Category = require("./category");
var _Fact = require("./fact");
var _Images = require("./images");
var _Project = require("./project");
var _Sequelizemeta = require("./sequelizemeta");
var _Url = require("./url");
var _User = require("./user");
  var Category = _Category(sequelize, DataTypes);
  var Fact = _Fact(sequelize, DataTypes);
  var Images = _Images(sequelize, DataTypes);
  var Project = _Project(sequelize, DataTypes);
  var Sequelizemeta = _Sequelizemeta(sequelize, DataTypes);
  var Url = _Url(sequelize, DataTypes);
  var User = _User(sequelize, DataTypes);

  Project.belongsTo(User, { as: "user", foreignKey: "user_id"});
  Project.belongsTo(Category, { as: "category", foreignKey: "category_id"});
  Project.hasMany(Fact, {as: 'Fact', foreignKey: 'doc_id'})
  Project.hasMany(Images, {as: 'Images', foreignKey: 'doc_id'})
  Project.hasMany(Url, {as: 'Url', foreignKey: 'doc_id'})
  Category.hasMany(Project, {as: "project", foreignKey: "category_id"})
  User.hasMany(Project, { as: "projects", foreignKey: "user_id"});

  module.exports = {
    Category,
    Fact,
    Images,
    Project,
    Sequelizemeta,
    Url,
    User,
  }
