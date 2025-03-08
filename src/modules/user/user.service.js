import { User } from "../../db/models/user.model.js"
import { messages, compareHash} from "../../utils/index.js"
import cloudinary from "../../utils/file upload/cloud-config.js"
import { defaultImage } from "../../utils/global-variables.js"



export const getloginProfile = async (req, res, next) => {
        const user = await User.findById(req.authUser._id)
        if (!user) {
            return next(new Error(messages.user.notFound, { cause: 404 }))
        }

        return res.status(200).json({ success: true , data: user })
}

export const getUserProfile = async (req, res, next) => {
    const {id} = req.params
    const user = await User.findById(id).select("userName firstName lastName DOB phone profilePic coverPic")

    if (!user) {
        return next(new Error(messages.user.notFound, { cause: 404 }))
    }

    return res.status(200).json({ success: true , data: user })
}

export const freeze = async (req,res,next) => {
    const user = await User.findById(req.authUser._id)
    if (!user) return next(new Error(messages.user.notFound, { cause: 404 }))

    user.isDeleted = true
    user.deletedAt = Date.now()
    await user.save()

    res.status(200).json({ success: true, message: messages.user.Freezed })
}

export const uploadProfilePic = async (req,res,next) => {
    let options = {}
    if(req.authUser.ProfilePic.public_id == defaultImage.public_id ){
        options.folder = `Search-Job-App/users/${req.authUser._id}/profile-pic`
    }else{
        options.public_id = req.authUser.ProfilePic.public_id
    }

    const { secure_url , public_id } = await cloudinary.uploader.upload(
        req.file.path,
        options
    )

    const user =await User.findByIdAndUpdate(req.authUser._id , 
    {   
        "profilePic.secure_url" : secure_url ,
        "profilePic.public_id" : public_id 
    },
    { new: true }
    )

    return res.status(200).json({success : true , message : messages.IMAGE.Updated  , data : user })
}

export const uploadCoverPic = async (req,res,next) => {
    let options = {}
    if(req.authUser.coverPic.public_id == defaultImage.public_id ){
        options.folder = `Search-Job-App/users/${req.authUser._id}/cover-pic`
    }else{
        options.public_id = req.authUser.coverPic.public_id
    }

    const { secure_url , public_id } = await cloudinary.uploader.upload(
        req.file.path,
        options
    )

    const user =await User.findByIdAndUpdate(req.authUser._id , 
    {   
        "coverPic.secure_url" : secure_url ,
        "coverPic.public_id" : public_id 
    },
    { new: true }
    )

    return res.status(200).json({success : true , message : messages.IMAGE.Updated  , data : user })
}

export const deleteProfilePic = async (req,res,next) => {
    if (!req.authUser.profilePic || !req.authUser.profilePic.public_id) {
        return next(new Error("No profile picture to delete" , {cause : 400}))
    }

    if (req.authUser.profilePic.public_id != defaultImage.public_id) {
        await cloudinary.uploader.destroy(req.authUser.profilePic.public_id)
    }

    const user = await User.findByIdAndUpdate(
        req.authUser._id,
        { profilePic : defaultImage },
        { new: true }
    )

    return res.status(200).json({ success: true, message: messages.IMAGE.Deleted , data: user })
}

export const deleteCoverPic = async (req,res,next) => {
    if (!req.authUser.coverPic || !req.authUser.coverPic.public_id) {
        return next(new Error("No cover picture to delete" , {cause : 400}))
    }

    if (req.authUser.coverPic.public_id !== defaultImage.public_id) {
        await cloudinary.uploader.destroy(req.authUser.coverPic.public_id)
    }

    const user = await User.findByIdAndUpdate(
        req.authUser._id,
        { "coverPic": defaultImage },
        { new: true }
    )

    return res.status(200).json({ success: true, message: messages.IMAGE.Deleted, data: user })
}

export const updateUser = async (req,res,next) => {
    const {phone , firstName , lastName , gender , DOB} = req.body
    const updateFields = {}
    if (firstName) updateFields.firstName = firstName
    if (lastName) updateFields.lastName = lastName
    if (DOB) updateFields.DOB = DOB
    if (gender) updateFields.gender = gender
    if (phone) updateFields.phone = phone
    console.log(updateFields)

    const user = await User.findByIdAndUpdate(req.authUser._id ,  updateFields  , { new : true } )

    if (!user) return next(new Error(messages.user.notFound , { cause : 404 }))

    return res.status(200).json({ success : true , message : messages.user.Updated , data : user })
}

export const updatePassword = async (req,res,next) => {
    const {cPassword , newPassword} = req.body

    const user =await User.findById(req.authUser._id)

    if (!user) return next(new Error(messages.user.notFound , { cause : 404 }))

    const isMatch = await compareHash({ password : cPassword , hashedPassword: user.password })
    
    if (!isMatch) return next(new Error('Wrong current Password', { cause: 400 }))
    
    user.password = newPassword
    user.save()

    return res.status(200).json({ success : true , message : messages.user.Updated , data : user })
}










