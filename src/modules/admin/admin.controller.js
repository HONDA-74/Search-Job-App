import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { roles } from "../../utils/global-variables.js";
import { validation } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../utils/index.js";
import * as adminService from "./admin.service.js"
import * as adminValidation from "./admin.validation.js"

const router = Router()

router.patch(
    "/ban-user/:userId",
    authenticate,
    isAuthorized(roles.ADMIN),
    validation(adminValidation.banUser),
    asyncHandler(adminService.updateUserBanStatus)
)

router.patch(
    "/ban-company/:companyId",
    authenticate,
    isAuthorized(roles.ADMIN),
    validation(adminValidation.banCompany),
    asyncHandler(adminService.updateCompanyBanStatus)
)

router.patch(
    "/approve-company/:companyId",
    authenticate,
    isAuthorized(roles.ADMIN),
    validation(adminValidation.approveCompany),
    asyncHandler(adminService.approveCompany)
)

export default router