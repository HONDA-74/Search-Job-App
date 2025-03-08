import joi from "joi"
import { genders, generalFields } from "../../utils/global-variables.js"



export const profileIdSchema = joi.object({
    id : generalFields.id.required()
}).required()

export const updateUserSchema = joi.object({
    firstName : joi.string(),
    lastName : joi.string(),
    DOB : joi.date().iso().less('now')
        .custom((value, helpers) => {
            const age = new Date().getFullYear() - new Date(value).getFullYear()
            if (age < 18) {
                return helpers.error("User must be at least 18 years old")
            }
            return value
        }),
    gender : joi.string().valid( genders.FEMALE , genders.MALE ),
    phone : joi.string()
})

export const updatePasswordSchema = joi.object({
    cPassword : joi.string().min(6).required(),
    newPassword : joi.string().min(6).required(),
    repeatPassword : joi.string().valid(joi.ref("newPassword")).min(6).required(),
}).required()

export const photoSchema = joi.object({
    attachment : generalFields.attachment.required()
}).required()