const {Project,Category, Facts, Urls, Fact, Images, Url, Page,ProjectBol, Imagess} = require('../../../models/init-models')
const HttpException = require('../../utils/HttpException.utils')
const {validationResult} = require('express-validator')
const sequelize = require('sequelize')
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
              as: 'category',
              attributes:[
                'id',
                'page_id',
                'title',
                'img',
                'music_type'
              ],
              include:[
                {model: Page, as: 'page'}
              ]
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
            },
            {
              model: ProjectBol,
              as: 'ProjectBols',
              include:[
                {model: Urls, as: "Urlss"},
                {model: Facts, as: "Factss"}
              ]
            }
          ],
          order:[
            ['id','ASC']
          ]
      })
      if(!model){
        throw new HttpException(404, "no information found")
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
            as: 'category',
            attributes:[
              'id',
              'page_id',
              'title',
              'img',
              'music_type'
            ],
            include:[
              {model: Page, as: 'page'}
            ]
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
        ],
        order:[
          ['id','ASC']
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
    let date_time = Math.floor(new Date().getTime() / 1000);
    req.body.Images = []
    if(req.files.images){
      for(let key of req.files.images){
        req.body.Images.push(key)
    }
    }
    const {Facts,Images,Urls,ProjectBols, ...body} = req.body;
      let model = await Project.create({
        'category_id': body.category_id, 
        'name': body.name,
        'cart': body.cart,
        'date_time': body.date_time ? date_time : body.date_time,
        'aftor_name': body.aftor_name,
        'aftor_img': req.files.project_img ? req.files.project_img[0].filename : "",
        'description': body.description,
        'extra_description': body.extra_description,
        'user_id': body.user_id
      })
      if(Images.length > 0){
        this.#addImages(Images, model)
      }
     this.#addFatcts(Facts, model)
     this.#addBol(ProjectBols, model,Images)
     this.#addUrl(Urls, model)
      res.status(200).send({
        error: false,  
        error_code: 200,
        message: 'create information',
        data: "model"
    });
   }

   update = async(req,res,next) => {
      this.checkValidation(req)
      req.body.Images = []
      if(req.files.images){
        for(let key of req.files.images){
          req.body.Images.push(key)
      }
      }
      let {Facts,Images,Urls,ProjectBols,updateImage, ...body} = req.body;
      updateImage = updateImage ? JSON.parse(updateImage) : ''
      for(let key of updateImage){
         key.url = key.url.replace("http://localhost:3010/api/v1/admin-app/images/","")
         Images.push(key)
      }
      // console.log(Images);
      let date_time = Math.floor(new Date().getTime() / 1000);
      let model = await Project.findOne({
        where:{
            id: req.params.id
        }
      })
      if(!model){
        throw HttpException(404, 'no information found')
      }
      if(body.change_img === 'true'){
        this.#deletePicture(model.aftor_img);
        model.aftor_img = req.files.project_img ? req.files.project_img[0].filename : ""
      }
      model.category_id = body.category_id
      model.name = body.name
      model.cart = body.cart
      model.date_time = body.date_time ? date_time : body.date_time,
      model.aftor_name = body.aftor_name
      model.description = body.description
      model.extra_description = body.extra_description
      model.user_id = body.user_id
      model.save()
      if(Images.length > 0){
        this.#addImages(Images, model,false)
      }
      this.#addFatcts(Facts, model, false)
      this.#addBol(ProjectBols, model,Images, false)
      this.#addUrl(Urls, model, false)
      res.status(200).send({
        error: false,
        error_code: 200,
        message: 'Updated',
        data: 'model'
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
   #addBol = async(arr,model,Images,insert=true) => {
      arr = arr ? JSON.parse(arr) : ''
      if(arr.length > 0){
        const {Factss,Urlss, ...data} = arr[0] 
        let modelBol;
        if(!insert){
          modelBol = await ProjectBol.findOne({
            where:{
               doc_id: model.id
            }
          })
          await this.#deleteBol(model.id)
       }
        let bol = {
          category_id: model.category_id,
          name: data.name,
          aftor_name: data.aftor_name,
          aftor_img: model.aftor_img,
          cart: data.cart,
          description: data.description,
          extra_description: data.extra_description,
          date_time: model.date_time,
          doc_id: model.id
        }
       let bols = await ProjectBol.create(bol)
       if(insert){
        await this.#addFatctsBol(Factss,bols,modelBol)
        await this.#addUrlBol(Urlss,bols,modelBol)
        await this.#addImagess(Images,bols,modelBol)
       }
       else{
        await this.#addFatctsBol(Factss,bols,modelBol,false)
        await this.#addUrlBol(Urlss,bols,modelBol,false)
        await this.#addImagess(Images,bols,modelBol,false)
       }
      }
   }
   #addFatctsBol = async(arr, bols,model, insert = true) => {
       if(!insert){
          await this.#deleteFactBol(model.id)
       }
       for(let key of arr){
         let table = {
           text: key.text,
           doc_id: bols.id
         }
          await Facts.create(table)
       }
   }
   #addUrlBol = async(arr, bols,model, insert = true) => {
    if(!insert){
       await this.#deleteUrlBol(model.id)
    }
    if(arr.length > 0){
       for(let key of arr){
          let url = {
            name: key.name,
            link: key.link,
            type: key.type,
            color: key.color,
            doc_id: bols.id
          }
          await Urls.create(url)
       }
    }
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
           url: key.filename ? key.filename : key.url,
           doc_id: model.id
         }
          await Images.create(table)
       }
   }
   #addImagess = async(arr, bols,model, insert = true) => {
    if(!insert){
       for(let key of arr){
          this.#deletePicture(key.url)
       }
       await this.#deleteImgs(model.id)
    }
    for(let key of arr){
      let table = {
        url: key.filename ? key.filename : key.url,
        doc_id: bols.id
      }
       await Imagess.create(table)
    }
}
   #addUrl = async(arr, model, insert = true) => {
    arr = arr ? JSON.parse(arr) : ''
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
   #deleteFact = async(doc_id) => {
      await Fact.destroy({where:{ doc_id: doc_id}})
   }
   #deleteFactBol = async(doc_id) => {
    await Facts.destroy({where:{ doc_id: doc_id}})
 }
 #deleteUrlBol = async(doc_id) => {
  await Urls.destroy({where:{ doc_id: doc_id}})
}
   #deleteBol = async(doc_id) => {
    await ProjectBol.destroy({where:{ doc_id: doc_id}})
 }
   #deleteImg = async(doc_id) => {
    await Images.destroy({where:{ doc_id: doc_id}})
    }
    #deleteImgs = async(doc_id) => {
      await Imagess.destroy({where:{ doc_id: doc_id}})
      }
    #deleteUrl = async(doc_id) => {
      await Url.destroy({where:{ doc_id: doc_id}})
    }
   delete = async(req,res,next) => {
    await this.#deleteFact(req.params.id)
    await this.#deleteFactBol(req.params.id)
    await this.#deleteUrlBol(req.params.id)
    await this.#deleteImg(req.params.id)
    await this.#deleteImgs(req.params.id)
    await this.#deleteUrl(req.params.id)
    await this.#deleteBol(req.params.id)
      let model = await Project.destroy({
        where:{
            id: req.params.id
        }
      })
      if(!model){
        throw HttpException(404, "Data not found")
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

