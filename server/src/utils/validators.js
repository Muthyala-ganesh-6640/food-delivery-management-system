const { body, validationResult } = require('express-validator');

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({ field: err.path || err.param, message: err.msg })),
    });
  };
};

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

const restaurantValidation = [
  body('name').trim().notEmpty().withMessage('Restaurant name is required'),
  body('cuisine').notEmpty().withMessage('Cuisine types are required'),
  body('address.street').notEmpty().withMessage('Street address is required'),
  body('address.city').notEmpty().withMessage('City is required'),
];

const foodValidation = [
  body('name').trim().notEmpty().withMessage('Food item name is required'),
  body('price').isNumeric().withMessage('Valid price is required'),
  body('category').notEmpty().withMessage('Category is required'),
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  restaurantValidation,
  foodValidation,
};
