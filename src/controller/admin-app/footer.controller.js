const {Footer,Url, Footers} = require('../../../models/init-models')
const HttpException = require('../../utils/HttpException.utils')
const {validationResult} = require('express-validator')
const fs = require('fs')
const sequelize = require('sequelize');
class footerController {
  getOne = async(req,res,next) => {
      let model = await Footer.findOne({
          where:{
            id: req.params.id
          }, 
          include:[
            {model: Url, as: 'Urls'}
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
    const model = await Footer.findAll({
      include:[
        {
          model: Url,
          as: 'Urls'
        }
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
   create = async(req,res,next) => {
    this.checkValidation(req)
      const {Urls, ...body} = req.body;
      let model = await Footer.create({
        'location': body.location,
        'contact': body.contact,
        'email': body.email,
        'founders': body.founders,
        'meneger': body.meneger
      })
      this.#addUrl(Urls, model)
      // this.#addFoters(Foters, model)
      res.status(200).send({
        error: false,  
        error_code: 200,
        message: 'create information',
        data: model
    });
   }

   update = async(req,res,next) => {
      this.checkValidation(req)
      const {Urls, ...body} = req.body;
      let model = await Footer.findOne({
        where:{
            id: req.params.id
        }
      })
      if(!model){
        throw HttpException(404, 'Data not found')
      }
      model.location = body.location
      model.contact = body.contact
      model.email = body.email
      model.founders = body.founders
      model.meneger = body.meneger
      model.save()
      this.#addUrl(Urls, model, false)
      // this.#addFoters(Foters, model, false)
      res.status(200).send({
        error: false,
        error_code: 200,
        message: 'updated',
        data: model
    });
   }
   #addUrl = async(arr, model, insert = true) => {
    if(!insert){
       await this.#deleteUrl(model.id)
    }
    if(arr.length > 0){
       for(let key of arr){
          let url = {
            name: key.name,
            link: key.link,
            type: key.type,
            color: key.color,
            doc_id: model.id
          }
          await Url.create(url)
       }
    }
   }
   #addFoters = async(arr, model, insert = true) => {
    if(!insert){
       await this.#deleteFot(model.id)
    }
    if(arr.length > 0){
       for(let key of arr){
          let url = {
            location: key.location,
            contact: key.contact,
            email: key.email,
            founders: key.founders,
            meneger: key.meneger,
            doc_id: model.id
          }
          await Footers.create(url)
       }
    }
   }
   #deleteUrl = async(doc_id) => {
    await Url.destroy({where:{ doc_id: doc_id}})
   }
  #deleteFot = async(doc_id) => {
    await Footers.destroy({where:{ doc_id: doc_id}})
   }
   delete = async(req,res,next) => {
      await this.#deleteUrl(req.params.id)
      let model = await Footer.destroy({
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

module.exports = new footerController()

