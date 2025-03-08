import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { roles } from "../../utils/global-variables.js";
import { validation } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../utils/index.js";
import * as chatService from "./chat.service.js"
import * as chatValidation from "./chat.validation.js" 

const router = Router()

router.get(
    "/:userId",
    authenticate,
    isAuthorized(roles.USER),
    validation(chatValidation.getChat),
    asyncHandler(chatService.getChat)
)

router.delete(
    "/:id",
    authenticate,
    isAuthorized(roles.USER),
    validation(chatValidation.deleteChat),
    asyncHandler(chatService.deleteChat)
)

export default router