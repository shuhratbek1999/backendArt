const {Page} = require('../../../models/init-models')
const HttpException = require('../../utils/HttpException.utils')
const {validationResult} = require('express-validator')
class PageController {
  getOne = async(req,res,next) => {
      let model = await Page.findOne({
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
    const model = await Page.findAll({
      order:[
        ['id', 'ASC']
      ]
    })
    res.status(200).send({
        error: false,
        error_code: 200,
        message: 'Malumotlar chiqdi',
        data: model
    });
   }
   checkValidation = (req) => { 
     const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validation faild', errors);
    }
}
}

module.exports = new PageController()

