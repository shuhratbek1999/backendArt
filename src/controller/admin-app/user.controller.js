const HttpException = require('../../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {secret_jwt} = require('../../startup/config');
const {User} = require('../../../models/init-models')

/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class UserController {
    userLogin = async (req, res, next) => {
        this.checkValidation(req);
        const {  password, login } = req.body;
        let query = {
            name: login
        }
        const model = await User.findOne({
            where: query, 
            raw: true
        });
        if(!model){
            throw new HttpException(404, 'end pound not found')
        }
        const isMatch = await bcrypt.compare(password, model.password)
        // console.log(isMatch,model); 
        delete model['password'];
        if(!isMatch){
            throw new HttpException(404, "password wrong")
        }

        const token = jwt.sign({ user_id: model.id.toString() }, secret_jwt, {
            expiresIn: '864h'
        });
        if(!token){
           throw new HttpException(404, "token not found")
        }
        model.token = token
        res.status(200).send({
            error: false,
            error_code: 200,
            message: 'Ro\'yhatdan o\'tdingiz',
            data: model
        });
    };
    byName = async (req, res, next) => {
        const model = await User.findAll({
                    attributes: ['id','name']
        })
        res.status(200).send({
            error: false,
            error_code: 20,
            message: 'Malumot keldi', 
            data: model
        });
    }
    getAll = async (req, res, next) =>{
        const model = await User.findAll(); 
        res.status(200).send({
            error: false,
            error_code: 200,
            message: 'Malumotlar chiqdi',
            data: model
        });
       }
    getOne = async (req, res, next) =>{
        const model = await User.findOne({
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
    create = async(req, res, next) => {
        let body = req.body
        this.checkValidation(req); 
        if (body.password) {
            body.password = await bcrypt.hash(body.password, 8);
        }
        const modell = await User.create({
            'name': body.login,
            'password': body.password,
            'role': body.role
        });
        // delete req.body['password']
        res.status(200).send({
            error: false,  
            error_code: 200,
            message: 'Siz muvaffaqiyatli ro\'yhatdan o\'tdingiz',
            data: modell
        });
    }
    update = async (req, res, next) =>{
        const salt = await bcrypt.genSalt();
        let data = req.body;
            const pasXash = await bcrypt.hash(data.password.toString(), salt);
            delete data['password'];
            data['password'] = pasXash;
            const model = await User.findOne({
                where:{
                    id: req.params.id
                }
            })
        model.name = data.name;
        model.role = data.role;
        model.password = data.password;
        model.save();
        res.status(200).send({
            error: false,
            error_code: 200,
            message: 'updated',
            data: model
        });
    }
    delete = async (req, res, next) =>{
        const model = await User.destroy({
            where:{
                id: req.params.id
            }
        });
        if(!model){
            throw new HttpException(404, "bunday id yoq")
        }
        else{
        res.status(200).send({
            error: false,
            error_code: 200,
            message: 'Malumot ochirildi',
            data: model
        });
    }
    }
    checkValidation = (req) => { 
        const errors = validationResult(req)
        if (!errors.isEmpty) {
            throw new HttpException(400, 'Validation faild', errors);
        }
    }

    // hash password if it exists
    hashPassword = async (req) => {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 8);
        }
    }
    
}




/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new UserController;