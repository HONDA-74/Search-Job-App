import { Router } from "express";
import * as userServise from "./user.service.js"
import { asyncHandler } from "../../utils/index.js"
import { authenticate } from "../../middlewares/auth.middleware.js"
import { fileValidation, roles } from "../../utils/global-variables.js";
import { cloudUpload } from "../../utils/file upload/cloud-multer.js";
import { validation } from "../../middlewares/validation.middleware.js";
import * as userValidation from "./user.validation.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
const router = Router()

router.get("/login-profile" , authenticate ,isAuthorized(roles.USER),asyncHandler( userServise.getloginProfile ) )

router.get("/user-profile/:id" , authenticate ,isAuthorized(roles.USER),validation(userValidation.profileIdSchema) ,asyncHandler( userServise.getUserProfile ) ) 

router.delete("/freeze" , authenticate  ,isAuthorized(roles.USER),asyncHandler( userServise.freeze ) ) 

router.post("/profile-pic",
    authenticate,
    isAuthorized(roles.USER),
    cloudUpload(fileValidation.IMAGES ).single("image") ,
    validation(userValidation.photoSchema),
    asyncHandler(userServise.uploadProfilePic)
)

router.post("/cover-pic",
    authenticate,
    isAuthorized(roles.USER),
    cloudUpload(fileValidation.IMAGES ).single("image") ,
    validation(userValidation.photoSchema),
    asyncHandler(userServise.uploadCoverPic) 
)

router.delete("/profile-pic",
    authenticate,
    isAuthorized(roles.USER),
    asyncHandler(userServise.deleteProfilePic)
)

router.delete("/cover-pic",
    authenticate,
    isAuthorized(roles.USER),
    asyncHandler(userServise.deleteCoverPic) 
)

router.put(
    "/update" , 
    authenticate , 
    isAuthorized(roles.USER) ,
    validation(userValidation.updateUserSchema) ,
    asyncHandler( userServise.updateUser )
)

router.put(
    "/update-password" , 
    authenticate , 
    isAuthorized(roles.USER),
    validation(userValidation.updatePasswordSchema) , 
    asyncHandler( userServise.updatePassword )
)

export default router