import { Schema, Types, model } from "mongoose";
import { defaultImage } from "../../utils/global-variables.js";
import { Job } from "./job.model.js";

const companySchema = new Schema(
    {
        companyName: { type: String , unique: [true, "Company name already exits"] , required: [true, "Company name is required"] },
        description: { type: String , required: [true, "Company description is required"] },
        industry: { type: String , required: [true, "Industry type is required"] },
        address: { type: String , required: [true, "Company address is required"] },
        numberOfEmployees: {
            type: String,
            enum: ['1-10', '11-20', '21-50', '51-100', '101-200', '201-500', '500+'],
            required: true
        },    
        companyEmail: { type: String , unique: [true, "Company name already exits"] , required: [true, "Company email is required"] },
        createdBy: { type: Types.ObjectId , ref: "User" , required: true },
        logo: {
            secure_url : {type : String , default : defaultImage.secure_url } ,
            public_id : {type : String , default :defaultImage.public_id }
        },
        coverPic: {
            secure_url : {type : String , default : defaultImage.secure_url } ,
            public_id : {type : String , default :defaultImage.public_id }
        },
        HRs: [
            {
                type: Types.ObjectId,
                ref: "User",
            },
        ],
        bannedAt: { type: Date , default: null },
        isBanned :  { type: Boolean , default: false },
        deletedAt: { type: Date , default: null },
        isDeleted :  { type: Boolean , default: false },
        legalAttachment: {
            secure_url: { type: String, required: true },
            public_id: { type: String, required: true },
        },
        approvedByAdmin: { type: Boolean , default: false },
    },
    {
        timestamps: true,
    }
)

companySchema.virtual('jobs', {
    ref: 'Job',
    localField: '_id',
    foreignField: 'companyId'
})

companySchema.pre("save", async function (next) {
    const jobs = await Job.find({ companyId : this._id })
    if( jobs.length > 0 )
    for (const job of jobs) {
        job.isDeleted = this.isDeleted
        await job.save() 
    }
    next()
})

export const Company = model("Company", companySchema)
