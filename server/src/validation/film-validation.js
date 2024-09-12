import Joi from "joi";

const createFilmValidation = Joi.object({
    title: Joi.string().max(100).required(),
    description: Joi.string().max(255).optional(),
    image: Joi.string().max(255).email().optional(),
});

const getFilmValidation = Joi.number().positive().required();

const updateFilmValidation = Joi.object({
    id: Joi.number().positive().required(),
    title: Joi.string().max(100).required(),
    description: Joi.string().max(255).optional(),
    image: Joi.string().max(255).email().optional(),
});

const searchFilmValidation = Joi.object({
    page: Joi.number().min(1).positive().default(1),
    size: Joi.number().min(1).positive().max(100).default(10),
    title: Joi.string().optional(),
})

export {
    createFilmValidation,
    getFilmValidation,
    updateFilmValidation,
    searchFilmValidation
}
