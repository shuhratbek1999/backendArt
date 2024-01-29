const express = require('express');
const router = express.Router();
const categoryController = require('../../controller/admin-app/page.controller');
const auth = require('../../middleware/auth.middleware');
const Role = require('../../utils/roles.utils');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');

router.get('/all', auth(), awaitHandlerFactory(categoryController.getAll));
router.get('/one/:id',   auth(), awaitHandlerFactory(categoryController.getOne));
module.exports = router;