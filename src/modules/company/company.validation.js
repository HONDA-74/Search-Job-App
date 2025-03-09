import joi from "joi"
import { generalFields } from "../../utils/global-variables.js"

export const companySchema = joi.object({
    companyName : joi.string().required(),
    description : joi.string().required(),
    industry : joi.string().required(),
    address : joi.string().required(),
    companyEmail : joi.string().email().required(),
    numberOfEmployees : joi.string()
    .valid('1-10', '11-20', '21-50', '51-100', '101-200', '201-500', '500+')
    .required(),
    // HRs : joi.array().items(generalFields.id.required()).required(),
    HRs : joi.array().items(joi.string().email().required()).required(),
    attachment : generalFields.attachment.required()
}).required()

export const updateCompanySchema = joi.object({
    id : generalFields.id.required(),
    companyName : joi.string(),
    description : joi.string(),
    industry : joi.string(),
    address : joi.string(),
    companyEmail : joi.string().email(),
    numberOfEmployees : joi.string()
    .valid('1-10', '11-20', '21-50', '51-100', '101-200', '201-500', '500+'),
    HR : joi.string().email(),
}).required()

export const deleteSchema = joi.object({
    id : generalFields.id.required()
})

export const getCompanyByIdSchema = joi.object({
    id : generalFields.id.required()
})

export const getCompanyByNameSchema = joi.object({
    name : joi.string().required()
})

export const picSchema = joi.object({
    attachment : generalFields.attachment.required()
})