"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceDataValidation = exports.storeDataValidation = void 0;
const celebrate_1 = require("celebrate");
const storeDataValidation = (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        name: celebrate_1.Joi.string().required(),
        address: celebrate_1.Joi.string().required(),
        description: celebrate_1.Joi.string().required()
    })
});
exports.storeDataValidation = storeDataValidation;
const serviceDataValidation = (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        name: celebrate_1.Joi.string().required(),
        price: celebrate_1.Joi.string().required(),
        store_id: celebrate_1.Joi.string().required(),
    })
});
exports.serviceDataValidation = serviceDataValidation;
const serviceUserVAlidation = (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({})
});
