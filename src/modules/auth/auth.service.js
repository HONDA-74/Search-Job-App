import { User } from "../../db/models/user.model.js"
import {  compareHash , generateToken, sendOtp, messages, createOtp, verifyToken , verifyIdToken  } from "../../utils/index.js"
import { OTPtypes } from "../../utils/global-variables.js"

export const signup = async (req , res , next) => { 
    const {firstName , lastName, email , password , DOB , gender , phone} = req.body
    
    const newUser = new User({
        firstName,
        lastName,
        gender,
        email,
        password,
        DOB,
        phone
    })
    await newUser.save()

    const savedOtp = await createOtp({ email , type : OTPtypes.confirmEmail})

    const isSent = await sendOtp({ otp:savedOtp, email })
    if (!isSent) {
        return next(new Error(messages.OTP.notSent , {cause : 500}))
    }

    return res.status(201).json({success: true ,message: `${messages.user.Created},${messages.OTP.sent}` })
}

export const resendOTP = async (req, res, next) => {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
        return next(new Error(messages.user.notFound , { cause: 404 }))
    }

    const savedOtp = await createOtp({ email , type : OTPtypes.confirmEmail })
    await sendOtp({ otp: savedOtp.otp, email })

    return res.status(200).json({ success: true, message: messages.OTP.sent })
}

export const otpConfirm = async (req, res, next) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email })
    if (!user) {
        return next(new Error(messages.user.notFound, { cause: 404 }))
    }

    if (!user.OTP || user.OTP.length == 0) {
        return next(new Error(messages.OTP.notFound, { cause: 400 }))
    }

    const otpRecord = user.OTP.find(record => record.type == OTPtypes.confirmEmail)

    if (!otpRecord) {
        return next(new Error(messages.OTP.invalid, { cause: 400 }))
    }

    if (new Date() > new Date(otpRecord.expiresIn)) {
        user.updateOne({$pull: { OTP: { type: OTPtypes.confirmEmail } }})
        return next(new Error(messages.OTP.expired + ", request resend new code", { cause: 400 }))
    }

    const isMatch = await compareHash({password : otp , hashedPassword : otpRecord.code });
    if (!isMatch) {
        return next(new Error(messages.OTP.invalid, { cause: 400 }));
    }

    user.isConfirmed = true

    user.OTP = user.OTP.filter(record => record != otpRecord)

    await user.save()

    return res.status(200).json({ success: true, message: messages.OTP.verified })
}

export const login = async (req, res, next) => {
    const { email,  password } = req.body

    let user = await User.findOne({ email })

    if (!user) return next(new Error('Invalid credentials', { cause: 400 }))

    if (user.isConfirmed == false) {
        return next(new Error('Email not activated yet, please activate it first and try again', { cause: 400 }))
    }

    if (user.isDeleted == true) {
        user.isDeleted = false
    }

    const matchPassword = await compareHash({ password, hashedPassword: user.password })

    if (!matchPassword) return next(new Error('Invalid credentials', { cause: 400 }))

    await user.save()

    const refreshToken = generateToken({
        payload: { userId: user._id, email: user.email },
        option: { expiresIn: '7d' }
    })

    const accessToken = generateToken({
        payload: { userId: user._id, email: user.email },
        option: { expiresIn: '1h' }
    })

    res.status(200).json({ success: true, message: 'Login successfully', refreshToken, accessToken })
}

export const loginWithGmail = async (req,res,next) => {
    const {idToken } = req.body
    
    const {email } =await verifyIdToken(idToken)
    
    let user = await User.findOne({ email })
    
    if(!user){
        return next(new Error(messages.user.notFound , {cause : 400}))
    }
    if (user.isDeleted == true) {
        user.isDeleted = false
        await user.save()
    }

    const refreshToken = generateToken( 
        { 
            payload : { userId : user._id , email : user.email } ,
            option : { expiresIn: '7d' } 
        })
    const accessToken = generateToken( 
        { 
            payload : { userId : user._id , email : user.email } ,
            option : { expiresIn: '1h' } 
        })

    res.status(200).json({ success : true , message: 'Login successfully', refreshToken , accessToken })
}

export const signupWithGmail = async (req,res,next) => {
    const {idToken , DOB , phone } = req.body
    
    const {email ,given_name,family_name, picture } =await verifyIdToken(idToken)
    
    let existUser = await User.findOne({ email })
    
    if(existUser){
        return next(new Error(messages.user.alreadyExist + `, go login with this Email : ${email}` , {cause : 400}))
    }
    const newUser = new User({
        email ,
        firstName :given_name ,
        lastName : family_name ,
        ProfilePic: { secure_url: picture } ,
        provider : "google" ,
        isConfirmed : true ,
        DOB,
        phone
    })
    await newUser.save()
    
    return res.status(200).json({ success : true , message: 'Signup successfully'})
}

export const resfreshToken = async (req,res,next) => {
    const {refreshToken} = req.body
    const result = verifyToken({token : refreshToken })

    if (result.error) {
        return next(new Error(result.error))
    }

    const user = await User.findOne({_id : result.userId , isDeleted : false})
    if (!user) {
        return next(new Error('User not found', { cause: 404 }))
    }

    const tokenIssuedAt = new Date(result.iat * 1000)
    if (user.changeCredentialTime && tokenIssuedAt < user.changeCredentialTime) {
        return next(new Error('Password or Email has been updated. Please log in again.' , {cause : 403}))
    }

    const accessToken = generateToken( 
        { 
            payload : { userId : result.userId , email : result.email } ,
            option : { expiresIn: '1h' } 
        })

        return res.status(200).json({ success : true , message: 'access token generated successfully', accessToken })
}

export const forgetPassword = async (req,res,next) => {
    const {email} = req.body
    
    const user =await User.findOne({email , isConfirmed : true ,isDeleted : false})
    if(!user){
        return next(new Error("User not found" , {cause : 404}))
    }

    const savedOtp =await createOtp({email , type : OTPtypes.forgetPassword })
    await sendOtp({ otp : savedOtp , email })

    return res.status(200).json({ success : true , message: 'OTP send successfully' })
}

export const resetPassword = async (req,res,next) => {
    const { otp, password , email } = req.body 

    const user = await User.findOne({ email , isConfirmed : true , isDeleted : false })

    if (!user) {
        return next(new Error('User not found', { cause: 404 }));
    }
    
    if (!user.OTP || user.OTP.length == 0) {
        return next(new Error(messages.OTP.notFound, { cause: 400 }))
    }

    const otpRecord = user.OTP.find(record => record.type == OTPtypes.forgetPassword)

    if (!otpRecord) {
        return next(new Error(messages.OTP.invalid, { cause: 400 }))
    }

    if (new Date() > new Date(otpRecord.expiresIn)) {
        user.OTP = user.OTP.filter(record => record != otpRecord)
        return next(new Error(messages.OTP.expired + " , " +messages.user.Deleted , { cause: 400 }))
    }

    const isMatch = await compareHash({password : otp , hashedPassword : otpRecord.code })
    if (!isMatch) {
        return next(new Error(messages.OTP.invalid, { cause: 400 }))
    }
    
    user.password = password
    await user.save()
    
    
    return res.status(200).json({
        success: true,
        message: 'Password updated successfully',
    })
}


