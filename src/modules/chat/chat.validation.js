import joi from "joi";
import { generalFields } from "../../utils/global-variables.js";

export const getChat = joi.object({
    userId : generalFields.id.required()
}).required()

export const deleteChat =joi.object({
    id : generalFields.id.required()
}).required()