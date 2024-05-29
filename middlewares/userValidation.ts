import { celebrate, Joi, Segments } from 'celebrate';

const loginValidation = celebrate({
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string()
            .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
            .required()
            .min(6),
    }),
});

const signupValidation = celebrate({
    [Segments.BODY]: Joi.object().keys({
        names: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(6)
    })
})

export {
    loginValidation,
    signupValidation
}