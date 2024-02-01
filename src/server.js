const express = require("express");
const app = express();
const path = require('path')
require('./startup/logging')();
require('./startup/db')();
const {port, } = require('./startup/config');
const jwt = require('jsonwebtoken');
require('./startup/routes')(app); 
// require('./controllers/admin-app/cron')();
const server = app.listen(port, () => console.log(`🚀 Server running on port ${port}!`));
module.exports = app;