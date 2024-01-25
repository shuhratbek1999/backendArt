const { body } = require('express-validator');
const { User } = require('../../../../models/init-models');

exports.nasiyaTolov = [
   body('cleint_id')
        .exists()
        .withMessage('name is required')
        .isInt()
        .withMessage('Int typeda kiriting'),
   body('price')
        .exists()
        .withMessage('price is required')
        .isDecimal()
        .withMessage('Number typeda kiriting'),
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