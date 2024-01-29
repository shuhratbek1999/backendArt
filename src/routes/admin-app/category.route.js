const express = require('express');
const router = express.Router();
const categoryController = require('../../controller/admin-app/category.controller');
const auth = require('../../middleware/auth.middleware');
const Role = require('../../utils/roles.utils');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, './upload')
    },
    filename: function(req, file, cb){
        // console.log(file,"file")
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'){
        cb(null, true)
    }else{
        cb(null, false)
    }
}
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
})

const  {category}  = require('../../middleware/validators/admin-app/categoryValidator.middleware');
router.get('/all', auth(), awaitHandlerFactory(categoryController.getAll));
router.get('/alls', auth(), awaitHandlerFactory(categoryController.getAlls));
router.get('/one/:id',   auth(), awaitHandlerFactory(categoryController.getOne));
router.post('/create',upload.fields([{name: 'cat_img', maxCount: 1}]), category, awaitHandlerFactory(categoryController.create));
router.patch('/update/:id',upload.fields([{name: 'cat_img', maxCount: 1}]), category, auth(), awaitHandlerFactory(categoryController.update));
router.delete('/delete/:id', auth(), awaitHandlerFactory(categoryController.delete));
module.exports = router;