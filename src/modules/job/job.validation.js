import joi from "joi";
import { generalFields } from "../../utils/global-variables.js";

export const jobSchema = joi.object({
    companyId : generalFields.id.required(),
    jobTitle : joi.string().required(),
    jobLocation : joi.string().valid("onsite", "remotely", "hybrid").required(),
    workingTime : joi.string().valid("part-time", "full-time").required(),
    seniorityLevel : joi.string().valid("fresh", "Junior", "Mid-Level", "Senior", "Team-Lead", "CTO").required(),
    jobDescription : joi.string().required(),
    technicalSkills : joi.array().items(joi.string().required()),
    softSkills : joi.array().items(joi.string().required()),
}).required()

export const updateSchema = joi.object({
    id : generalFields.id.required(),
    jobTitle : joi.string(),
    jobLocation : joi.string().valid("onsite", "remotely", "hybrid"),
    workingTime : joi.string().valid("part-time", "full-time"),
    seniorityLevel : joi.string().valid("fresh", "Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"),
    jobDescription : joi.string(),
    technicalSkills : joi.array().items(joi.string().required()),
    softSkills : joi.array().items(joi.string().required()),
    closed : joi.boolean()
}).required()

export const deleteSchema = joi.object({
    id : generalFields.id.required(),
}).required()

export const getJobsSchema = joi.object({
    companyId : generalFields.id,
    id : generalFields.id,
    search : joi.string(),
    limit : joi.number(),
    skip : joi.number(),
    sort : joi.string()
})

export const getFilteredSchema = joi.object({
    limit : joi.number(),
    skip : joi.number(),
    sort : joi.string(),
    jobTitle : joi.string(),
    jobLocation : joi.string().valid("onsite", "remotely", "hybrid"),
    workingTime : joi.string().valid("part-time", "full-time"),
    seniorityLevel : joi.string().valid("fresh", "Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"),
    technicalSkills : joi.array().items(joi.string().required()),
})

export const getApplications = joi.object({
    limit : joi.number(),
    skip : joi.number(),
    sort : joi.string(),
    companyId : generalFields.id,
    id : generalFields.id.required(),
})

export const applyJob = joi.object({
    id : generalFields.id.required(),
    attachment : generalFields.attachment.required()
}).required()

export const handleApplication = joi.object({
    applicationId : generalFields.id.required(),
    status : joi.string().valid("accepted", "rejected").required()
}).required()
