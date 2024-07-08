import { celebrate, Joi, Segments } from "celebrate";

const storeDataValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().messages({
      "any.required": "Name is required",
      "string.base": "Name must be a string",
    }),
    address: Joi.string().required().messages({
      "any.required": "Address is required",
      "string.base": "Address must be a string",
    }),
    phone: Joi.string().required().messages({
      "any.required": "Phone is required",
      "string.base": "Phone must be a string",
    }),
    email: Joi.string().required().messages({
      "any.required": "Email is required",
      "string.email": "Email must be a string",
    }),
    description: Joi.string().required().messages({
      "any.required": "Description is required",
      "string.base": "Description must be a string",
    }),
    logo: Joi.string().required().messages({
      "any-required": "logo is required",
      "string.base": "logo must be a string",
    }),
  }),
});

const serviceDataValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    price: Joi.string().required(),
    storeId: Joi.string().required(),
  }),
});

export { storeDataValidation, serviceDataValidation };
