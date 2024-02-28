const express = require('express');
const router = express.Router();
const FooterController = require('../../controller/admin-app/footer.controller');
const auth = require('../../middleware/auth.middleware');
const Role = require('../../utils/roles.utils');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');


router.get('/all', awaitHandlerFactory(FooterController.getAll));
router.get('/one/:id', awaitHandlerFactory(FooterController.getOne));
router.post('/create',auth(), awaitHandlerFactory(FooterController.create));
router.patch('/update/:id', auth(), awaitHandlerFactory(FooterController.update));
router.delete('/delete/:id', auth(), awaitHandlerFactory(FooterController.delete));
module.exports = router;