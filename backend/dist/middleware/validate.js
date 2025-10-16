"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = exports.validateObjectId = exports.validateId = exports.validate = void 0;
const express_validator_1 = require("express-validator");
const errorMiddleware_1 = require("./errorMiddleware");
const validate = (validations) => {
    return async (req, _res, next) => {
        try {
            // Run all validations in parallel
            await Promise.all(validations.map(validation => validation.run(req)));
            const result = (0, express_validator_1.validationResult)(req);
            if (result.isEmpty()) {
                return next();
            }
            // Format validation errors
            const formattedErrors = result.array().map(err => {
                const validationError = err;
                return {
                    field: validationError.param,
                    message: validationError.msg,
                    location: validationError.location
                };
            });
            // Create custom error with validation details
            const error = new errorMiddleware_1.AppError(400, 'Validation failed', true);
            error.errors = formattedErrors;
            throw error;
        }
        catch (error) {
            if (error instanceof errorMiddleware_1.AppError) {
                next(error);
            }
            else {
                next(new errorMiddleware_1.AppError(500, 'Internal validation error'));
            }
        }
    };
};
exports.validate = validate;
const validateId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};
exports.validateId = validateId;
const validateObjectId = (value, fieldName) => {
    if (!(0, exports.validateId)(value)) {
        return new errorMiddleware_1.AppError(400, `Invalid ${fieldName} ID format`);
    }
    return null;
};
exports.validateObjectId = validateObjectId;
const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
exports.validateEmail = validateEmail;
//# sourceMappingURL=validate.js.map