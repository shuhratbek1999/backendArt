const express = require('express');
const router = express.Router();
const ProjectController = require('../../controller/admin-app/project.controller');
const auth = require('../../middleware/auth.middleware');
const Role = require('../../utils/roles.utils');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './upload/');
      },
     
    filename: function(req,file,cb){
        cb(null, new Date().toISOString().replace(/:/g, '-') +'-'+ file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
        //return cb(new Error('Only images are allowed'))
    }
}

var upload = multer({
    storage: storage,
    limits:{
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})
const  {project}  = require('../../middleware/validators/admin-app/projectValidator.middleware');
router.get('/all', awaitHandlerFactory(ProjectController.getAll));
router.get('/one/:id',   auth(), awaitHandlerFactory(ProjectController.getOne));
router.post('/create',upload.fields([{name: 'images', maxCount: 8},{name: 'project_img', maxCount: 1}]), awaitHandlerFactory(ProjectController.create))
router.patch('/update/:id', upload.fields([{name: 'images', maxCount: 15},{name: 'project_img', maxCount: 1}]), project, auth(), awaitHandlerFactory(ProjectController.update));
router.delete('/delete/:id', auth(), awaitHandlerFactory(ProjectController.delete));
module.exports = router;