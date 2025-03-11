import {Schema , model , Types } from "mongoose";
import { jobLocation, seniorityLevel, workingTime } from "../../utils/global-variables.js";
import { Application } from "./application.model.js";



const jobSchema = new Schema(
    {
        jobTitle: { type: String , required: true },
        jobLocation: { type: String , enum: [jobLocation.HYBIRD , jobLocation.ONSITE , jobLocation.REMOTELY] , required: true },
        workingTime: { type: String , enum: [workingTime.FULL_TIME , workingTime.PART_TIME] , required: true },
        seniorityLevel: {
            type: String,
            enum: [seniorityLevel.CTO , seniorityLevel.FRESH , seniorityLevel.JOINIOR , seniorityLevel.MID_LEVEL , seniorityLevel.SENIOR , seniorityLevel.TEAM_LEAD],
            required: true,
        },
        jobDescription: { type: String , required: true },
        technicalSkills: {type: [String] },
        softSkills: { type: [String] },
        addedBy: { type: Types.ObjectId , ref: "User" , required: true },
        updatedBy: { type: Types.ObjectId , ref: "User" },
        closed: { type: Boolean , default: false },
        isDeleted: { type: Boolean , default: false },
        companyId: {type: Types.ObjectId , ref: "Company" , required: true },
    },
    { timestamps: true } 
)

jobSchema.virtual('applications', {
    ref: 'Application',
    localField: '_id',
    foreignField: 'jobId'
})

jobSchema.pre("save", async function (next) {
    if (this.isModified("isDeleted") ){
        const applications = await Application.find({ jobId : this._id })
        if( applications.length > 0 )
        for (const application of applications) {
            application.isDeleted = this.isDeleted
            await application.save()
        }
    }

    next()
})

export const Job=model("Job", jobSchema)
