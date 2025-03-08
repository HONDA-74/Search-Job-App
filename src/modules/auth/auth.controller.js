import { Router } from "express";
import * as authService from "./auth.service.js"
import { asyncHandler } from "../../utils/index.js"
import { validation } from "../../middlewares/validation.middleware.js"
import * as authValidation from "./auth.validation.js"
const router = Router()

router.post("/signup" , validation( authValidation.signupSchema ) , asyncHandler(authService.signup) )
//confirm otp
router.get("/otp-confirm" , validation(authValidation.otpSchema) , asyncHandler(authService.otpConfirm) )

router.get("/send-new-otp" , validation(authValidation.sendOtpSchema) ,asyncHandler( authService.resendOTP ) )

router.post("/login"  , validation( authValidation.loginSchema ) , asyncHandler(authService.login) )
//login with gmail google
router.post("/login-gmail" , validation(authValidation.loginGmailSchema) , asyncHandler(authService.loginWithGmail ))

router.post("/signup-gmail" , validation(authValidation.signupGmailSchema) , asyncHandler(authService.signupWithGmail ))

router.post("/refresh-token" ,validation(authValidation.refreshTokenSchema) , asyncHandler(authService.resfreshToken) )

router.post("/forget-password" , validation(authValidation.forgetPasswordSchema), asyncHandler( authService.forgetPassword ) )

router.put("/reset-password" , validation(authValidation.resetPasswordSchema) , asyncHandler( authService.resetPassword ) )

export default router
