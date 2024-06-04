"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupValidation = exports.loginValidation = void 0;
const celebrate_1 = require("celebrate");
const loginValidation = (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        email: celebrate_1.Joi.string().required().email(),
        password: celebrate_1.Joi.string()
            .required()
            .min(6),
    }),
});
exports.loginValidation = loginValidation;
const signupValidation = (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        names: celebrate_1.Joi.string().required(),
        email: celebrate_1.Joi.string().required().email(),
        password: celebrate_1.Joi.string().required().min(6),
        role: celebrate_1.Joi.string().valid('owner', 'customer')
    }),
});
exports.signupValidation = signupValidation;
