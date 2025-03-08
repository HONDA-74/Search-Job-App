import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { roles } from "../../utils/global-variables.js";
import { validation } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../utils/index.js";
import * as appService from "./app.service.js"
import * as appValidation from "./app.validation.js"

const router = Router({mergeParams : true})
//bonus api
router.get(
    "/excel-sheet",
    authenticate,
    isAuthorized(roles.USER),
    validation(appValidation.appToExcel),
    asyncHandler(appService.applicationsToExcel)
)

export default router