import joi from "joi";
import { generalFields } from "../../utils/global-variables.js";

export const appToExcel = joi.object({
    companyId : generalFields.id.required(),
    date : joi.date().required()
}).required()

