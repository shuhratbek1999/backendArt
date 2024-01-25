const { body } = require('express-validator');

exports.createUser = [
   body('name')
        .exists()
        .withMessage('user_name toldiring')
     //    .isString()
     //    .withMessage('string typeda kiriting')
        .isLength({min: 3, max: 300})
        .withMessage('eng kamida 3 ta harfdan iborat bolsin'),
    body('password')
         .exists()
         .isString()
         .withMessage('parol string tipida'),
    body('role')
         .exists()
         .isString()
         .withMessage('role string tipida')
];