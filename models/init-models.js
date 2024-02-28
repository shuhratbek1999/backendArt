var DataTypes = require("sequelize").DataTypes;
const sequelize = require("../src/db/db-sequelize")
var _Category = require("./category");
var _Fact = require("./fact");
var _Facts = require("./facts");
var _Footer = require("./footer");
var _Images = require("./images");
var _Page = require("./page");
var _Project = require("./project");
var _ProjectBol = require("./project_bol");
var _Sequelizemeta = require("./sequelizemeta");
var _Url = require("./url");
var _Urls = require("./urls");
var _User = require("./user");

  var Category = _Category(sequelize, DataTypes);
  var Fact = _Fact(sequelize, DataTypes);
  var Facts = _Facts(sequelize, DataTypes);
  var Footer = _Footer(sequelize, DataTypes);
  var Images = _Images(sequelize, DataTypes);
  var Page = _Page(sequelize, DataTypes);
  var Project = _Project(sequelize, DataTypes);
  var ProjectBol = _ProjectBol(sequelize, DataTypes);
  var Sequelizemeta = _Sequelizemeta(sequelize, DataTypes);
  var Url = _Url(sequelize, DataTypes);
  var Urls = _Urls(sequelize, DataTypes);
  var User = _User(sequelize, DataTypes);

  Project.belongsTo(User, { as: "user", foreignKey: "user_id"});
  Project.belongsTo(Category, { as: "category", foreignKey: "category_id"});
  Project.hasMany(Fact, {as: 'Fact', foreignKey: 'doc_id'})
  Project.hasMany(Images, {as: 'Images', foreignKey: 'doc_id'})
  Project.hasMany(ProjectBol, {as: 'ProjectBols', foreignKey: 'doc_id'})
  Project.hasMany(Url, {as: 'Url', foreignKey: 'doc_id'})
  ProjectBol.hasMany(Urls, {as: 'Urlss', foreignKey: 'doc_id'})
  ProjectBol.hasMany(Facts, {as: 'Factss', foreignKey: 'doc_id'})
  ProjectBol.hasMany(Images, {as: 'Images', foreignKey: 'doc_id'})
  Category.hasMany(Project, {as: "project", foreignKey: "category_id"})
  Category.hasMany(ProjectBol, {as: "projects", foreignKey: "category_id"})
  Category.belongsTo(Page, {as: "page", foreignKey: "page_id"})
  User.hasMany(Project, { as: "projects", foreignKey: "user_id"});
  Footer.hasMany(Url, { as: "Urls", foreignKey: "doc_id"});
  module.exports = {
    Category,
    Fact,
    Facts,
    Footer,
    Images,
    Page,
    Project,
    ProjectBol,
    Sequelizemeta,
    Url,
    Urls,
    User,
  }
