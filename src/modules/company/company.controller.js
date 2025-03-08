import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { validation } from "../../middlewares/validation.middleware.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { asyncHandler } from "../../utils/index.js";
import { fileValidation, roles } from "../../utils/global-variables.js";
import { cloudUpload } from "../../utils/file upload/cloud-multer.js";
import jobRouter from "../job/job.controller.js"
import appRouter from "../application/app.controller.js"
import * as companyValidation from "./company.validation.js";
import * as companyService from "./company.service.js";

const router = Router()
router.use("/:companyId?/job" , jobRouter)
router.use("/:companyId?/application" , appRouter)

router.post(
    "/" , 
    authenticate , 
    cloudUpload([ ...fileValidation.IMAGES , ...fileValidation.FILES ]).single("legalAttachment") ,
    validation(companyValidation.companySchema) , 
    isAuthorized( roles.USER ) , 
    asyncHandler(companyService.addCompany)
)

router.put(
    "/",
    authenticate ,
    validation(companyValidation.updateCompanySchema) ,
    isAuthorized(roles.USER ) ,
    asyncHandler(companyService.updateCompany)
)

router.get(
    "/",
    authenticate ,
    validation(companyValidation.getCompanyByNameSchema),
    isAuthorized(roles.USER),
    asyncHandler(companyService.searchByName)
)

router.get(
    "/:id",
    authenticate ,
    validation(companyValidation.getCompanyByIdSchema),
    isAuthorized(roles.USER) ,
    asyncHandler(companyService.getCompanyById)
)

router.delete("/logo-pic",
    authenticate,
    asyncHandler(companyService.deleteLogoPic)
)

router.delete("/cover-pic",
    authenticate,
    asyncHandler(companyService.deleteCoverPic) 
)

router.delete(
    "/:id",
    authenticate ,
    validation(companyValidation.deleteSchema) ,
    isAuthorized(roles.ADMIN , roles.USER) ,
    asyncHandler(companyService.softDelete)
)

router.post("/logo-pic",
    authenticate,
    cloudUpload(fileValidation.IMAGES ).single("image") ,
    validation(companyValidation.picSchema),
    asyncHandler(companyService.uploadLogoPic)
)

router.post("/cover-pic",
    authenticate,
    cloudUpload(fileValidation.IMAGES ).single("image") ,
    validation(companyValidation.picSchema),
    asyncHandler(companyService.uploadCoverPic) 
)



export default router
