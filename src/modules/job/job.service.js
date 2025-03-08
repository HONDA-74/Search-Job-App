import { Job } from "../../db/models/job.model.js";
import { Company } from "../../db/models/company.model.js";
import { User } from "../../db/models/user.model.js";
import { messages, sendEmail } from "../../utils/index.js";
import { Application } from "../../db/models/application.model.js";
import cloudinary from "../../utils/file upload/cloud-config.js";
import { applicationEmailTemplate } from "../../templates/application-email.js";
import { statusApp } from "../../utils/global-variables.js";

export const addJob = async (req, res, next) => {
    const { jobTitle, jobLocation , jobDescription, softSkills,  workingTime, seniorityLevel, technicalSkills } = req.body;
    
    const company = await Company.findById(req.params.companyId)
    if (!company) return next(new Error(messages.company.notFound, { cause: 404 }))

    if(!company.approvedByAdmin) return next(new Error( messages.company.notApproved , {cause : 400}))

    if(company.isBanned) return next(new Error("The Company is banned!" , {cause : 400}))

    if (req.authUser.id != company.createdBy.toString() && 
        !company.HRs.includes(req.authUser._id) )
        {
        return next(new Error(messages.user.notAllowed, { cause: 403 }))
        }

    const job = await Job.create({
        jobTitle,
        jobLocation,
        jobDescription,
        softSkills,
        workingTime,
        seniorityLevel,
        technicalSkills,
        companyId: company._id,
        addedBy: req.authUser._id
    })

    return res.status(201).json({ success: true, message: messages.job.Created, data: job })
}

export const updateJob = async (req, res, next) => {
    const { id } = req.params;
    const { jobTitle, jobLocation , jobDescription, softSkills,  workingTime, seniorityLevel, technicalSkills , closed} = req.body;

    const job = await Job.findById(id).populate("companyId")
    if (!job) return next(new Error(messages.job.notFound, { cause: 404 }))

    if (job.addedBy.toString() !== req.authUser.id) {
        return next(new Error(messages.user.notAllowed, { cause: 403 }))
    }

    if(job.companyId.isBanned) return next(new Error("The Company is banned!" , {cause : 400}))

    if(jobTitle) job.jobTitle = jobTitle
    if(jobLocation) job.jobLocation = jobLocation
    if(jobDescription) job.jobDescription = jobDescription
    if(softSkills?.length > 0) job.softSkills = softSkills
    if(workingTime) job.workingTime = workingTime
    if(seniorityLevel) job.seniorityLevel = seniorityLevel
    if(technicalSkills?.length > 0) job.technicalSkills = technicalSkills
    if(closed != undefined) job.closed = closed


    await job.save()

    return res.status(200).json({ success: true, message: messages.job.Updated, data: job })
}

export const deleteJob = async (req, res, next) => {
    const { id } = req.params

    const job = await Job.findById(id)
    if (!job) return next(new Error(messages.job.notFound, { cause: 404 }))

    const company = await Company.findById(job.companyId)
    if (!company) return next(new Error(messages.company.notFound, { cause: 404 }))
    if(company.isBanned) return next(new Error("The Company is banned!" , {cause : 400}))

    if (!company.HRs.includes(req.authUser._id)) {
        return next(new Error(messages.user.notAllowed, { cause: 403 }))
    }

    job.isDeleted = true
    await job.save()

    return res.status(200).json({ success: true, message: messages.job.Deleted })
}

export const getJobs = async (req, res, next) => {
    const { id , companyId } = req.params
    const {search} = req.body
    const {page = 1 , limit = 10, sort = "createdAt" } = req.query
    const skip = (page - 1) * limit

    let query = { isDeleted: false }
    if (companyId) query.companyId = companyId
    if (id) query._id = id
    if (search) {
        const company = await Company.findOne({companyName : { $regex: search, $options: "i" } })

        if(!company) return next(new Error(messages.company.notFound , { cause : 404}))

        query.companyId = company._id
    }

    let jobs = await Job.find(query).populate({
        path: "companyId",
        match: { isBanned: false },
    })  
    .skip(parseInt(skip))
    .limit(parseInt(limit))
    .sort({ [sort]: -1 })

    jobs = jobs.filter(job => job.companyId)

    if(jobs.length == 0) return next(new Error(messages.job.notFound , {cause : 404}))

    const totalCount = await Job.countDocuments(query)

    res.status(200).json({ success: true, data: jobs, totalCount })
}

export const getFilteredJobs = async (req, res, next) => {
    const { workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills, skip = 0, limit = 10, sort = "createdAt" } = req.query

    let query = { isDeleted: false }
    if (workingTime) query.workingTime = workingTime
    if (jobLocation) query.jobLocation = jobLocation
    if (seniorityLevel) query.seniorityLevel = seniorityLevel
    if (jobTitle) query.title = { $regex: jobTitle, $options: "i" }
    if (technicalSkills) query.technicalSkills = { $in: technicalSkills.split(",") }
    
    const jobs = await Job.find(query)
    .populate({
        path: "companyId",
        match: { isBanned: false },
    })  
    .skip(parseInt(skip))
    .limit(parseInt(limit))
    .sort({ [sort]: -1 })

    jobs = jobs.filter(job => job.companyId)

    if(jobs.length == 0) return next(new Error(messages.job.notFound , {cause : 404}))

    const totalCount = await Job.countDocuments(query)

    res.status(200).json({ success: true, data: jobs, totalCount })
}

export const getJobApplications = async (req, res, next) => {
    const { companyId , id } = req.params
    const { skip = 0, limit = 10, sort = "createdAt" } = req.query

    const company = await Company.findById(companyId)
    if (!company) return next(new Error(messages.company.notFound, { cause: 404 }))
    if(company.isBanned) next(new Error("The Company is banned!" , {cause : 400}))

    const authorizedUsers =[company.createdBy.toString(), ...company.HRs.map(hr => hr.toString())]

    if (!authorizedUsers.includes(req.authUser.id)) {
        return next(new Error(messages.user.notAllowed, { cause: 403 }))
    }

    const job = await Job.findById(id).populate({
        path: "applications",
        populate: { path: "userId", select: "name email" }
    })

    if (!job) return next(new Error(messages.job.notFound, { cause: 404 }))

    const totalCount = job.applications.length
    const paginatedApplications = job.applications.slice(parseInt(skip), parseInt(skip) + parseInt(limit))

    res.status(200).json({ success: true, data: paginatedApplications, totalCount })
}

export const applyToJob = async (req, res, next) => {
    const { id } = req.params

    const job = await Job.findById(id).populate("companyId").populate({path: "applications"})

    if (!job) return next(new Error(messages.job.notFound, { cause: 404 }))

    if (job.companyId.isBanned) return next(new Error("The company is banned!" , { cause : 403 }))

    if (job.applications.userId == req.authUser._id) {
        return next(new Error(messages.application.alreadyExist , { cause: 400 }))
    }

    const { secure_url , public_id } = await cloudinary.uploader.upload(
        req.file.path,
        {
            folder : `Search-Job-App/jobs/${job.id}/${req.authUser.email}`
        }
    )

    const newApplication =await Application.create({
        jobId : id,
        userId : req.authUser._id ,
        userCV :{ secure_url , public_id },
    })

    return res.status(201).json({ success: true, message: messages.application.Created , data : newApplication })
}

export const handleApplication = async (req, res, next) => {
    const { applicationId } = req.params
    const { status } = req.body

    const application = await Application.findById(applicationId).populate(
        {path : "jobId" , populate : {path : "companyId"}}
    )
    if(!application){
        return next(new Error(messages.application.notFound, { cause: 404 }))
    }

    if (!application.jobId.companyId.HRs.includes(req.authUser._id)) {
        return next(new Error(messages.user.notAllowed, { cause: 403 }))
    }

    const applicant = await User.findById(application.userId)
    if (!applicant) return next(new Error(messages.user.notFound, { cause: 404 }))
    
    application.status = status
    await application.save()

    // Send email notification
    const emailSubject = status === statusApp.ACCEPTED ? "Job Application Accepted" : "Job Application Rejected"
    const emailBody =applicationEmailTemplate({
        applicantName : applicant.userName , 
        jobTitle : application.jobId.jobTitle ,
        companyName : application.jobId.companyId.companyName ,
        status ,
    })

    sendEmail({to : applicant.email , subject : emailSubject , html : emailBody})

    return res.status(200).json({ success: true, message: `Application ${status}` , data : application })
}
