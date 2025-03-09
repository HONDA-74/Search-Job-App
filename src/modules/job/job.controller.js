import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { fileValidation, roles } from "../../utils/global-variables.js";
import { validation } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../utils/index.js";
import * as jobService from "./job.service.js"
import * as jobValidation from "./job.validation.js"
import { cloudUpload } from "../../utils/file upload/cloud-multer.js";

const router = Router({mergeParams : true})


router.post(
    "/",
    authenticate,
    isAuthorized(roles.USER),
    validation(jobValidation.jobSchema),
    asyncHandler(jobService.addJob)
)

router.put(
    "/:id",
    authenticate,
    isAuthorized(roles.USER),
    validation(jobValidation.updateSchema),
    asyncHandler(jobService.updateJob)
)

router.delete(
    "/:id",
    authenticate,
    isAuthorized(roles.USER),
    validation(jobValidation.deleteSchema),
    asyncHandler(jobService.deleteJob)
)

router.get(
    "/get-filter",
    authenticate,
    isAuthorized(roles.USER),
    validation(jobValidation.getFilteredSchema),
    asyncHandler(jobService.getFilteredJobs)
)

router.get(
    "/get-applications/:id",
    authenticate,
    isAuthorized(roles.USER),
    validation(jobValidation.getApplications),
    asyncHandler(jobService.getJobApplications)
)

router.get(
    "/:id?",
    authenticate,
    isAuthorized(roles.USER),
    validation(jobValidation.getJobsSchema),
    asyncHandler(jobService.getJobs)
)

router.put(
    "/apply-job/:id",
    authenticate,
    isAuthorized(roles.USER),
    cloudUpload( fileValidation.FILES ).single("attachment"),
    validation(jobValidation.applyJob),
    asyncHandler(jobService.applyToJob)
)

router.patch(
    "/handle-application/:applicationId" ,
    authenticate ,
    isAuthorized(roles.USER),
    validation(jobValidation.handleApplication),
    asyncHandler(jobService.handleApplication)
)


export default router