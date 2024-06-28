import { celebrate, Joi, Segments } from "celebrate";

const loginValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const signupValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    names: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    role: Joi.string().valid("owner", "customer"),
  }),
});

export { loginValidation, signupValidation };
