const { body } = require('express-validator');
const { User } = require('../../../../models/init-models');

exports.project = [
   body('category_id')
        .exists()
        .withMessage('name is required')
        .isInt()
        .withMessage('category is required'),
   body('name')
        .exists()
        .withMessage('name is required')
        .isString()
        .withMessage('name type is string'),
   body('user_id')
        .exists()
        .withMessage('user is required')
        .custom((value) => {
                return User.findOne({where: {id: value}}).then((val) => {
                    if(val == null){
                         return Promise.reject("User is not found")
                    }
                })
             })
];