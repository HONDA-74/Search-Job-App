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
    isAuthorized( roles.USER ) , 
    cloudUpload([ ...fileValidation.IMAGES , ...fileValidation.FILES ]).single("legalAttachment") ,
    validation(companyValidation.companySchema) , 
    asyncHandler(companyService.addCompany)
)

router.put(
    "/:id",
    authenticate ,
    isAuthorized(roles.USER ) ,
    validation(companyValidation.updateCompanySchema) ,
    asyncHandler(companyService.updateCompany)
)

router.get(
    "/",
    authenticate ,
    isAuthorized(roles.USER),
    validation(companyValidation.getCompanyByNameSchema),
    asyncHandler(companyService.searchByName)
)

router.get(
    "/:id",
    authenticate ,
    isAuthorized(roles.USER) ,
    validation(companyValidation.getCompanyByIdSchema),
    asyncHandler(companyService.getCompanyById)
)

router.delete("/logo-pic/:id",
    authenticate,
    isAuthorized(roles.USER),
    validation(companyValidation.deletePicSchema),
    asyncHandler(companyService.deleteLogoPic)
)

router.delete("/cover-pic/:id",
    authenticate,
    isAuthorized(roles.USER),
    validation(companyValidation.deletePicSchema),
    asyncHandler(companyService.deleteCoverPic) 
)

router.delete(
    "/:id",
    authenticate ,
    isAuthorized(roles.ADMIN , roles.USER) ,
    validation(companyValidation.deleteSchema) ,
    asyncHandler(companyService.softDelete)
)

router.post("/logo-pic/:id",
    authenticate,
    isAuthorized(roles.USER),
    cloudUpload(fileValidation.IMAGES ).single("image") ,
    validation(companyValidation.picSchema),
    asyncHandler(companyService.uploadLogoPic)
)

router.post("/cover-pic/:id",
    authenticate,
    isAuthorized(roles.USER),
    cloudUpload(fileValidation.IMAGES ).single("image") ,
    validation(companyValidation.picSchema),
    asyncHandler(companyService.uploadCoverPic) 
)



export default router
