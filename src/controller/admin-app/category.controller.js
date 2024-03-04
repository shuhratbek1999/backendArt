const {Category, Project, Images, Fact, Url, Page, ProjectBol, Urls, Facts, Imagess} = require('../../../models/init-models')
const HttpException = require('../../utils/HttpException.utils')
const {validationResult} = require('express-validator')
const fs = require('fs')
const sequelize = require('sequelize');
class CategoryController {
  getOne = async(req,res,next) => {
      let model = await Category.findOne({
          where:{
            id: req.params.id
          },
          include:[
            {model: Page, as: 'page'}
          ]
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
            {model: Url, as: 'Url'}
          ]
        },
        {model: Page, as: 'page'}
      ],
      order:[
        ['id', 'ASC']
      ]
    }); 
    res.status(200).send({
        error: false,
        error_code: 200,
        message: 'Malumotlar chiqdi',
        data: model
    });
   }
   getCategory = async(req,res, next) => {
      let model = await Category.findAll({
        include:[
          {
            model: Page, 
            as: 'page', 
            where: {
              name: req.params.category
            }
          },
          {
            model: Project,
            as: 'project',
            include:[
              {model: Images, as: 'Images'},
              {model: Fact, as: 'Fact'},
              {model: Url, as: 'Url'}
            ]
          }
        ],
        order:[
          [{model:Project,as:'project'},'id','DESC']
        ]
      })
      if(!model){
        throw new HttpException(404, 'data not found')
      }
      res.send({
        error: false,
        error_code: 200,
        data: model,
        message: "Malumot keldi"
      })
   }
   getCategorys = async(req,res, next) => {
    let model = await Category.findAll({
      include:[
        {
          model: Page, 
          as: 'page', 
          where: {
            name: req.params.category
          }
        },
        {
          model: ProjectBol,
          as: 'projects',
          include:[
            {model: Imagess, as: 'Imagess'},
            {model: Facts, as: 'Factss'},
            {model: Urls, as: 'Urlss'}
          ]
        }
      ],
      order:[
        [{model:ProjectBol,as:'projects'},'id','DESC']
      ]
    })
    if(!model){
      throw new HttpException(404, 'data not found')
    }
    res.send({
      error: false,
      error_code: 200,
      data: model,
      message: "Malumot keldi"
    })
 }
   getAlls = async(req,res,next) => {
    const model = await Category.findAll({
      attributes:[
        'id',
        'page_id',
        'title',
        'titles',
        'img',
        'music_type',
        [sequelize.literal('page.name'), 'name']
      ],
        include:[
          {model: Page, as: 'page', attributes: []},
          {
            model: Project,
            as: 'project',
            include:[
              {model: Images, as: 'Images'},
              {model: Fact, as: 'Fact'},
              {model: Url, as: 'Url'}
            ]
          }
        ]
    }) 
    res.status(200).send({
        error: false,
        error_code: 200,
        message: 'Malumotlar chiqdi',
        data: model
    });
   }
   create = async(req,res,next) => {
    this.checkValidation(req)
      let body = req.body;
      let img = req.files.cat_img[0].filename.replace(" ","")
      let model = await Category.create({
        'page_id': body.page_id,
        'title': body.title,
        'titles': body.titles,
        'music_type': body.music_type,
        'img': req.files ? img : ""
      })
      res.status(200).send({
        error: false,  
        error_code: 200,
        message: 'create information',
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
      model.page_id = body.page_id
      model.music_type = body.music_type
      model.title = body.title
      model.titles = body.titles
      model.save()
      res.status(200).send({
        error: false,
        error_code: 200,
        message: 'updated',
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
imgdelete = async(req,res,next) => {
  let model = await Images.destroy({
    where:{
        id: req.params.id
    }
  }) 
  await Images.destroy({
    where:{
        id: req.params.id
    }
  }) 
  if(!model){  
    throw HttpException(404, "data not found")
  }
  res.status(200).send({
    error: false,
    error_code: 200,
    message: 'Deleted'
  })
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

