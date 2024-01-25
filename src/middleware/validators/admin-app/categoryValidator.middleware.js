const { body } = require('express-validator');

exports.category = [
   body('name')
        .exists()
        .withMessage('name is required')
        .isLength({min: 3, max: 300})
        .withMessage('eng kamida 3 ta harfdan iborat bolsin')
];