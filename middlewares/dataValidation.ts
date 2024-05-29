import { celebrate, Joi, Segments } from 'celebrate';

const storeDataValidation = celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        address: Joi.string().required(),
        description: Joi.string().required(),
        owner_id: Joi.string().required(),
    })
});

const serviceDataValidation = celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        price: Joi.string().required(),
        store_id: Joi.string().required(),
    })
})

export {
    storeDataValidation,
    serviceDataValidation,
}