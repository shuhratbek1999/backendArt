const {Project,Category, User, Fact, Images, Url} = require('../../../models/init-models')
const HttpException = require('../../utils/HttpException.utils')
const {validationResult, body} = require('express-validator')
const fs = require('fs')
class ProjectController {
  getOne = async(req,res,next) => {
      let model = await Project.findOne({
          where:{
            id: req.params.id
          },
          include:[
            {
              model: Category,
              as: 'category'
            },
            {
              model: Fact,
              as: 'Fact'
            },
            {
              model: Images,
              as: 'Images'
            },
            {
              model: Url,
              as: 'Url'
            }
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
    const model = await Project.findAll({
        include:[
          {
            model: Category,
            as: 'category'
          },
          {
            model: Fact,
            as: 'Fact'
          },
          {
            model: Images,
            as: 'Images'
          },
          {
            model: Url,
            as: 'Url'
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
    // req.body.Images = JSON.parse(req.body.Images)
    req.body.Images = []
    for(let key of req.files.images){
         req.body.Images.push(key)
      }
      const {Facts,Images,Urls, ...body} = req.body;
      let date_time = Math.floor(new Date().getTime() / 1000);
      let model = await Project.create({
        'category_id': body.category_id, 
        'name': body.name,
        'date_time': date_time,
        'aftor_name': body.aftor_name,
        'aftor_img': req.files.project_img ? req.files.project_img[0].filename : "",
        'description': body.description,
        'extra_description': body.extra_description,
        'user_id': body.user_id
      })
     this.#addFatcts(Facts, model)
     this.#addImages(Images, model)
     this.#addUrl(Urls, model)
      res.status(200).send({
        error: false,  
        error_code: 200,
        message: 'Malumot qo\'shildi',
        data: "model"
    });
   }

   update = async(req,res,next) => {
      this.checkValidation(req)
      req.body.Images = []
      for(let key of req.files.images){
          req.body.Images.push(key)
      }
      const {Facts,Images,Urls, ...body} = req.body;
      let date_time = Math.floor(new Date().getTime() / 1000);
      let model = await Project.findOne({
        where:{
            id: req.params.id
        }
      })
      if(!model){
        throw HttpException(404, 'Malumot topilmadi')
      }
      console.log(body.change_img);
      if(body.change_img === 'true'){
        this.#deletePicture(model.aftor_img);
        model.aftor_img = req.files.project_img ? req.files.project_img[0].filename : ""
      }
      model.category_id = body.category_id
      model.name = body.name
      model.date_time = date_time
      model.aftor_name = body.aftor_name
      model.description = body.description
      model.extra_description = body.extra_description
      model.user_id = body.user_id
      model.save()
      this.#addFatcts(Facts, model, false)
      this.#addImages(Images, model, false)
      this.#addUrl(Urls, model, false)
      res.status(200).send({
        error: false,
        error_code: 200,
        message: 'Malumot tahrirlandi',
        data: model
    });
   }
   #deletePicture = (file) => {
      try{
        fs.unlinkSync('/upload', file)
      }
      catch(error){
        return 0
      }
      return 1
   }
   #addFatcts = async(arr, model, insert = true) => {
    arr = arr ? JSON.parse(arr) : ''
       if(!insert){
          await this.#deleteFact(model.id)
       }
       for(let key of arr){
         let table = {
           text: key.text,
           doc_id: model.id
         }
          await Fact.create(table)
       }
   }
   #addImages = async(arr, model, insert = true) => {
       if(!insert){
          for(let key of arr){
             this.#deletePicture(key.url)
          }
          await this.#deleteImg(model.id)
       }
       for(let key of arr){
         let table = {
           url: key.filename,
           doc_id: model.id
         }
          await Images.create(table)
       }
   }
   #addUrl = async(arr, model, insert = true) => {
    arr = arr ? JSON.parse(arr) : ''
       if(!insert){
          await this.#deleteUrl(model.id)
       }
       for(let key of arr){
        if(key.you_tube_url.length>0 || key.insta_url.length>0 || key.facebook_url.length>0 || key.sayt_url){
          let table = {
            insta_url: key.insta_url,
            facebook_url: key.facebook_url,
            you_tube_url: key.you_tube_url,
            sayt_url: key.sayt_url,
            doc_id: model.id
          }
           await Url.create(table)
        }
       }
   }
   #deleteFact = async(doc_id) => {
      await Fact.destroy({where:{ doc_id: doc_id}})
   }
   #deleteImg = async(doc_id) => {
    await Images.destroy({where:{ doc_id: doc_id}})
    }
    #deleteUrl = async(doc_id) => {
      await Url.destroy({where:{ doc_id: doc_id}})
    }
   delete = async(req,res,next) => {
    await this.#deleteFact(req.params.id)
    await this.#deleteImg(req.params.id)
    await this.#deleteUrl(req.params.id)
      let model = await Project.destroy({
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

module.exports = new ProjectController()

