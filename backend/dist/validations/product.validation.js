"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productValidation = void 0;
const express_validator_1 = require("express-validator");
const mongoose_1 = require("mongoose");
exports.productValidation = {
    create: [
        (0, express_validator_1.body)('name')
            .trim()
            .notEmpty()
            .withMessage('Product name is required')
            .isLength({ min: 2 })
            .withMessage('Product name must be at least 2 characters long'),
        (0, express_validator_1.body)('description')
            .trim()
            .notEmpty()
            .withMessage('Product description is required')
            .isLength({ min: 10 })
            .withMessage('Description must be at least 10 characters long'),
        (0, express_validator_1.body)('price')
            .isFloat({ min: 0 })
            .withMessage('Price must be a positive number'),
        (0, express_validator_1.body)('stock')
            .optional()
            .isInt({ min: 0 })
            .withMessage('Stock must be a non-negative integer'),
        (0, express_validator_1.body)('category')
            .optional()
            .custom(value => (0, mongoose_1.isValidObjectId)(value))
            .withMessage('Invalid category ID'),
        (0, express_validator_1.body)('brand')
            .optional()
            .custom(value => (0, mongoose_1.isValidObjectId)(value))
            .withMessage('Invalid brand ID'),
        (0, express_validator_1.body)('specifications')
            .optional()
            .isArray()
            .withMessage('Specifications must be an array'),
        (0, express_validator_1.body)('tags')
            .optional()
            .isArray()
            .withMessage('Tags must be an array')
    ],
    update: [
        (0, express_validator_1.param)('id')
            .custom(value => (0, mongoose_1.isValidObjectId)(value))
            .withMessage('Invalid product ID'),
        (0, express_validator_1.body)('name')
            .optional()
            .trim()
            .isLength({ min: 2 })
            .withMessage('Product name must be at least 2 characters long'),
        (0, express_validator_1.body)('price')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Price must be a positive number'),
        (0, express_validator_1.body)('stock')
            .optional()
            .isInt({ min: 0 })
            .withMessage('Stock must be a non-negative integer')
    ],
    getAll: [
        (0, express_validator_1.query)('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Page must be a positive integer'),
        (0, express_validator_1.query)('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Limit must be between 1 and 100'),
        (0, express_validator_1.query)('minPrice')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Minimum price must be a positive number'),
        (0, express_validator_1.query)('maxPrice')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Maximum price must be a positive number')
            .custom((value, { req }) => {
            if (req.query?.minPrice && parseFloat(value) <= parseFloat(String(req.query.minPrice))) {
                throw new Error('Minimum price must be lower than product price');
            }
            return true;
        })
    ],
    delete: [
        (0, express_validator_1.param)('id')
            .custom(value => (0, mongoose_1.isValidObjectId)(value))
            .withMessage('Invalid product ID')
    ]
};
//# sourceMappingURL=product.validation.js.map