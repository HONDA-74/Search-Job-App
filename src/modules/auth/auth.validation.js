import joi from "joi"


export const signupSchema = joi.object({
    firstName : joi.string().required(),
    lastName : joi.string().required(),
    email : joi.string().email().required(),
    gender : joi.string().required(),
    password : joi.string().min(6).required(),
    cPassword : joi.string().valid(joi.ref("password")).min(6).required(),
    DOB : joi.date().iso().less('now')
    .custom((value, helpers) => {
        const age = new Date().getFullYear() - new Date(value).getFullYear()
        if (age < 18) {
            return helpers.error("User must be at least 18 years old")
        }
        return value
    }).required(),
    phone : joi.string().required()
}).required() 

export const loginSchema = joi.object({
    email : joi.string().email().required(),
    password : joi.string().min(6).required(),
}).required()

export const otpSchema = joi.object({
    email : joi.string().email().required(),
    otp : joi.string().length(5).required(),
}).required()

export const forgetPasswordSchema = joi.object({
    email : joi.string().email().required(),
}).required() 

export const resetPasswordSchema = joi.object({
    email : joi.string().email().required(),
    otp : joi.string().length(5).required(),
    password : joi.string().min(6).required(),
    cPassword : joi.string().valid(joi.ref("password")).min(6).required(),
}).required() 

export const refreshTokenSchema = joi.object({
    refreshToken : joi.string().required()
}).required()

export const signupGmailSchema = joi.object({
    idToken : joi.string().required(),
    DOB : joi.date().iso().less('now')
    .custom((value, helpers) => {
        const age = new Date().getFullYear() - new Date(value).getFullYear()
        if (age < 18) {
            return helpers.error("User must be at least 18 years old")
        }
        return value
    }).required(),
    phone : joi.string().required()
}).required()

export const loginGmailSchema = joi.object({
    idToken : joi.string().required(),
}).required()

export const sendOtpSchema = joi.object({
    email : joi.string().email().required(),
}).required()