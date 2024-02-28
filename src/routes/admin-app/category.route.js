const express = require('express');
const router = express.Router();
const categoryController = require('../../controller/admin-app/category.controller');
const auth = require('../../middleware/auth.middleware');
const Role = require('../../utils/roles.utils');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const multer = require('multer')
const path = require("path")

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
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimetype = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));
    if (mimetype && extname) {
      return cb(null, true);
    }
    else{
        cb("Error: El archivo debe ser una imagen válida");
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
router.get('/all', awaitHandlerFactory(categoryController.getAll));
router.get('/alls', awaitHandlerFactory(categoryController.getAlls));
router.get('/one/:id', awaitHandlerFactory(categoryController.getOne));
router.get('/categoryAll/:category',  awaitHandlerFactory(categoryController.getCategory));
router.get('/categoryBol/:category',  awaitHandlerFactory(categoryController.getCategorys));
router.post('/create',auth(), upload.fields([{name: 'cat_img', maxCount: 1}]), category, awaitHandlerFactory(categoryController.create));
router.patch('/update/:id',auth(), upload.fields([{name: 'cat_img', maxCount: 1}]), category, auth(), awaitHandlerFactory(categoryController.update));
router.delete('/delete/:id', auth(), awaitHandlerFactory(categoryController.delete));
router.delete('/imgdelete/:id', auth(), awaitHandlerFactory(categoryController.imgdelete));
module.exports = router;