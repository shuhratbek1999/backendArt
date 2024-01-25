const {Category, Project, Images, Fact, Url} = require('../../../models/init-models')
const HttpException = require('../../utils/HttpException.utils')
const {validationResult} = require('express-validator')
const fs = require('fs')
class CategoryController {
  getOne = async(req,res,next) => {
      let model = await Category.findOne({
          where:{
            id: req.params.id
          }
      })
      if(!model){
        throw new HttpException(404, "bu id da malumot yo\'q")
    }
    res.status(200).send({
        error: false,
        error_code: 200,
        message: 'Malumot chiqdi',
        data: model
    });
  }
  getAll = async(req,res,next) => {
    const model = await Category.findAll({
      include:[
        {
          model: Project,
          as: 'project',
          include:[
            {model: Images, as: 'Images'},
            {model: Fact, as: 'Fact'},
            {model: Url, as: 'Url'},
          ]
        }
      ]
    }); 
    res.status(200).send({
        error: false,
        error_code: 200,
        message: 'Malumotlar chiqdi',
        data: model
    });
   }
   create = async(req,res,next) => {
    this.checkValidation(req)
      const body = req.body;
      let model = await Category.create({
        'name': body.name,
        'title': body.title,
        'img': req.files ? req.files.cat_img[0].filename : ""
      })
      res.status(200).send({
        error: false,  
        error_code: 200,
        message: 'Malumot qo\'shildi',
        data: model
    });
   }

   update = async(req,res,next) => {
      this.checkValidation(req)
      const body = req.body
      let model = await Category.findOne({
        where:{
            id: req.params.id
        }
      })
      if(!model){
        throw HttpException(404, 'Malumot topilmadi')
      }
      // console.log(typeof body.change_image)
      // console.log(body.change_image, req.files.cat_img[0]);
      if(body.change_image === 'true'){
        this.#deletePicture(model.img);
        model.img = req.files.cat_img[0].filename;
    }
      model.name = body.name
      model.title = body.title
      model.save()
      res.status(200).send({
        error: false,
        error_code: 200,
        message: 'Malumot tahrirlandi',
        data: model
    });
   }
   #deletePicture = (picture_name) => {
    try {
        fs.unlinkSync('upload/' + picture_name);
    } catch (error) {
        return 0;
    }
    return 1;
}
   delete = async(req,res,next) => {
    let cat = await Category.findOne({
      where:{
        id: req.params.id
      }
    })
    await this.#deletePicture(cat.img);
      let model = await Category.destroy({
        where:{
            id: req.params.id
        }
      }) 
      if(!model){  
        throw HttpException(404, "malumot mavjud emas")
      }
      res.status(200).send({
        error: false,
        error_code: 200,
        message: 'Malumot o\'chirildi'
      })
   }

   checkValidation = (req) => { 
     const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validation faild', errors);
    }
}
}

module.exports = new CategoryController()

