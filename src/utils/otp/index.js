import otpGenerator from "otp-generator"
import { User } from "../../db/models/user.model.js"
import { hash } from "../hash/hash.js"
import { OTPtypes } from "../global-variables.js"


export const createOtp = async ({email , type}) => {
    const otp = otpGenerator
    .generate(5 ,
    {   digits : true , 
        upperCaseAlphabets : false ,
        lowerCaseAlphabets : false ,
        specialChars : false 
    })

    const hashedOtp = await hash({password : otp})

    const otpObject = {
        code: hashedOtp,
        type,
    }

    await User.findOneAndUpdate({email},{$pull: { OTP: { type: type } }})

    await User.findOneAndUpdate({email},{$push: { OTP: otpObject }})
    
    return otp
}