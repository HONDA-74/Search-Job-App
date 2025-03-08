import { Company } from "../../db/models/company.model.js"
import { User } from "../../db/models/user.model.js"
import cloudinary from "../../utils/file upload/cloud-config.js"
import { defaultImage, roles } from "../../utils/global-variables.js"
import { messages } from "../../utils/index.js"



export const addCompany = async (req,res,next) => {
    const {companyName , description , industry , address , companyEmail , numberOfEmployees , HRs } = req.body

    const company = await Company.findOne({ $or: [{ companyName }, { companyEmail }] })
    if( company ) return next(new Error(messages.company.alreadyExist , {cause : 404}))

    //the user who is creating the company cant know the IDs of users so he will send the email insted of 
    const users = await User.find({ email : { $in : HRs } })

    if (users.length !== HRs.length) {
        return next(new Error("Some HR emails are not registered users", { cause: 400 }))
    }

    const HRsId =[]
    users.forEach((ele)=>{HRsId.push(ele._id)})

    const { secure_url , public_id } = await cloudinary.uploader.upload(
        req.file.path,
        {
            folder : `Search-Job-App/company/${req.authUser._id}/legal-attachment`
        }
    )

    const newCompany = await Company.create({
        companyName,
        companyEmail,
        description,
        industry,
        address,
        numberOfEmployees,
        HRs : HRsId,
        createdBy : req.authUser._id,
        legalAttachment : {
            secure_url,
            public_id
        }
    })

    return res.status(200).json({success : true , message : messages.company.Created , data : newCompany})
}

export const uploadLogoPic = async (req,res,next) => {
    let options = {}

    const company = await Company.findOne({createdBy : req.authUser._id , isDeleted : false })

    if(!company) return next(new Error(messages.company.notFound + " or " + messages.user.notAllowed, {cause : 403}))

    if(company.isBanned) return next(new Error("The Company is banned!" , {cause : 400}))

    if(company.logo.public_id == defaultImage.public_id ){
        options.folder = `Search-Job-App/company/${req.authUser._id}/logo-pic`
    }else{
        options.public_id = company.logo.public_id
    }

    const { secure_url , public_id } = await cloudinary.uploader.upload(
        req.file.path,
        options
    )

    company.logo.secure_url = secure_url
    company.logo.public_id = public_id

    company.save()

    return res.status(200).json({success : true , message : messages.IMAGE.Updated  , data : company })
}

export const uploadCoverPic = async (req,res,next) => {
    let options = {}

    const company = await Company.findOne({createdBy : req.authUser._id , isDeleted : false })

    if(!company) return next(new Error(messages.company.notFound + " or " + messages.user.notAllowed, {cause : 403}))

    if(company.isBanned) return next(new Error("The Company is banned!" , {cause : 400}))

    if(company.coverPic.public_id == defaultImage.public_id ){
        options.folder = `Search-Job-App/company/${req.authUser._id}/cover-pic`
    }else{
        options.public_id = company.coverPic.public_id
    }

    const { secure_url , public_id } = await cloudinary.uploader.upload(
        req.file.path,
        options
    )

    company.coverPic.secure_url = secure_url
    company.coverPic.public_id = public_id

    company.save()

    return res.status(200).json({success : true , message : messages.IMAGE.Updated  , data : company })
}

export const deleteLogoPic = async (req,res,next) => {
    const company = await Company.findOne({createdBy : req.authUser._id , isDeleted : false })

    if(!company) return next(new Error(messages.company.notFound + " or " + messages.user.notAllowed, {cause : 403}))

    if(company.isBanned) return next(new Error("The Company is banned!" , {cause : 400}))

    if (!company.logo || !company.logo.public_id ) {
        return next(new Error("No logo picture to delete" , {cause : 403}))
    }

    if (company.logo.public_id != defaultImage.public_id) {
        await cloudinary.uploader.destroy(company.logo.public_id)
    }

    company.logo = defaultImage
    company.save()

    return res.status(200).json({ success: true, message: messages.IMAGE.Deleted , data: company })
}

export const deleteCoverPic = async (req,res,next) => {
    const company = await Company.findOne({createdBy : req.authUser._id , isBanned :false })

    if(!company) return next(new Error(messages.company.notFound + " or " + messages.user.notAllowed, {cause : 403}))

    if(company.isBanned) return next(new Error("The Company is banned!" , {cause : 400}))

    if (!company.coverPic || !company.coverPic.public_id ) {
        return next(new Error("No Cover picture to delete" , {cause : 403}))
    }

    if (company.coverPic.public_id != defaultImage.public_id) {
        await cloudinary.uploader.destroy(company.coverPic.public_id)
    }

    company.coverPic = defaultImage
    company.save()

    return res.status(200).json({ success: true, message: messages.IMAGE.Deleted , data: company })
}

export const updateCompany = async (req,res,next) => {
    const {companyName , description , industry , address , companyEmail , numberOfEmployees , HR } = req.body

    const company = await Company.findOne({ createdBy : req.authUser._id , isDeleted : false })

    if(!company) return next(new Error(messages.company.notFound + " or " + messages.user.notAllowed , { cause : 404 }))

    if(company.isBanned) return next(new Error("The Company is banned!" , {cause : 400}))

    if(HR){
        const user = await User.findOne({ email :  HR })
        if (!user) return next(new Error("HR email is not registered users", { cause: 400 }))
        company.HRs.push(user._id)
    }
    if(companyName) company.companyName=companyName
    if(description) company.description=description
    if(industry) company.industry=industry
    if(address) company.address=address
    if(companyEmail) company.companyEmail=companyEmail
    if(numberOfEmployees) company.numberOfEmployees=numberOfEmployees
    company.save()

    return res.status(200).json({success : true , message : messages.company.Updated , data : company })
}

export const getCompanyById = async (req,res,next) => {
    const { id } = req.params

    const company = await Company.findOne({ _id: id, isDeleted: false }).populate('jobs')

    if (!company) return next(new Error(messages.company.notFound , { cause : 404 }))

    if(company.isBanned) return next(new Error("The Company is banned!" , {cause : 400}))

    res.status(200).json({ success : true , data : company })
}

export const searchByName = async (req,res,next) => {
    const { name } = req.body

    let companies = await Company.find({
        companyName: { $regex: name, $options: 'i' }, 
        isDeleted: false ,
        isBanned : false
    }).populate('jobs')

    if (companies.length == 0) return next(new Error(messages.company.notFound , { cause : 404 }))

    res.status(200).json({success : true , data : companies})
}

export const softDelete = async (req,res,next) => {
    const { id } = req.params
    const userRole = req.authUser.role

    const company = await Company.findById(id)
    if (!company) return next(new Error(messages.company.notFound , {cause : 404}))

    if (userRole !== roles.ADMIN && company.createdBy.toString() != req.authUser.id) {
        return next(new Error(messages.user.notAllowed + " to delete this company" , {cause : 403}))  
    }

    company.isDeleted = true
    company.deletedAt = Date.now()
    await company.save()

    res.status(200).json({success : true , message: "Company and its jobs soft deleted successfully" })
}