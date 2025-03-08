import joi from "joi"
import { isValidObjectId } from "mongoose"

export const roles = {
    ADMIN : "Admin",
    USER : 'User'
}

export const genders = {
    MALE  : "Male",
    FEMALE : "Female"
}

export const defaultImage = {
    secure_url : "https://res.cloudinary.com/dqnbkkjzu/image/upload/e_improve,w_300,h_600,c_thumb,g_auto/v1741350531/defult_g64mgy.jpg",
    public_id : "defult_g64mgy"
}

export const OTPtypes = {
    confirmEmail : "confirm email",
    forgetPassword : "forget password"
}

export const fileValidation ={
    IMAGES : ["image/jpg" , "image/jpeg" , "image/webp"],
    VIDEOS : ["video/mp4" , "video/mpeg"] ,
    FILES : ["text/plain" , "application/msword" , "application/pdf" ]
}

const isValidId = (value, helpers) => {
    return isValidObjectId(value) ? value : helpers.message("Invalid ObjectId");
}

export const generalFields = {
    id :  joi.custom(isValidId) ,
    attachment : joi.object({
                fieldname : joi.string().required(),
                originalname : joi.string().required(),
                encoding : joi.string().required(),
                mimetype : joi.string().required(),
                destination : joi.string().required(),
                filename : joi.string().required(),
                path : joi.string().required(),
                size : joi.number().required()
        }),
}

export const jobLocation = {
    ONSITE : "onsite" ,
    REMOTELY : "remotely" ,
    HYBIRD : "hybrid"
}

export const workingTime = {
    PART_TIME : "part-time" ,
    FULL_TIME : "full-time" 
}

export const seniorityLevel = {
    FRESH : "fresh",
    JOINIOR : "Junior" ,
    MID_LEVEL : "Mid-Level" ,
    SENIOR : "Senior" ,
    TEAM_LEAD : "Team-Lead" ,
    CTO : "CTO"
}

export const statusApp = {
    PENDING : "pending",
    ACCEPTED : "accepted",
    VIEWED : "viewed",
    IN_CONSIDERATION : "in consideration",
    REJECTED : "rejected"
}