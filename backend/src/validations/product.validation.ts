import { body, param, query } from 'express-validator';
import { isValidObjectId } from 'mongoose';

export const productValidation = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Product name is required')
      .isLength({ min: 2 })
      .withMessage('Product name must be at least 2 characters long'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Product description is required')
      .isLength({ min: 10 })
      .withMessage('Description must be at least 10 characters long'),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('stock')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Stock must be a non-negative integer'),
    body('category')
      .optional()
      .custom(value => isValidObjectId(value))
      .withMessage('Invalid category ID'),
    body('brand')
      .optional()
      .custom(value => isValidObjectId(value))
      .withMessage('Invalid brand ID'),
    body('specifications')
      .optional()
      .isArray()
      .withMessage('Specifications must be an array'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array')
  ],
  update: [
    param('id')
      .custom(value => isValidObjectId(value))
      .withMessage('Invalid product ID'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage('Product name must be at least 2 characters long'),
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('stock')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Stock must be a non-negative integer')
  ],
  getAll: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('minPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Minimum price must be a positive number'),
    query('maxPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Maximum price must be a positive number')
      .custom((value, { req }) => {
        if (req.query.minPrice && parseFloat(value) <= parseFloat(req.query.minPrice)) {
          throw new Error('Maximum price must be greater than minimum price');
        }
        return true;
      })
  ],
  delete: [
    param('id')
      .custom(value => isValidObjectId(value))
      .withMessage('Invalid product ID')
  ]
};