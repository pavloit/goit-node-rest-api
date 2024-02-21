import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email(),
    phone: Joi.number().required(),
})
    .min(2)
    .message("at least name and phone are required");

export const updateContactSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string(),
})
    .min(1)
    .message("You can change name phone or email, body can't be empty");