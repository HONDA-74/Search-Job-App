import joi from "joi"
import { generalFields } from "../../utils/global-variables.js"

export const banUser = joi.object({
    userId : generalFields.id.required()
})

export const banCompany = joi.object({
    companyId : generalFields.id.required()
}).required()

export const approveCompany = joi.object({
    companyId : generalFields.id.required()
}).required()