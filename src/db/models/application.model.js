import { Schema, Types, model } from "mongoose";
import { statusApp } from "../../utils/global-variables.js";



const applicationSchema = new Schema(
    {
        jobId: { type: Types.ObjectId , ref: "Job" , required: true },
        userId: {type: Types.ObjectId , ref: "User", required: true },
        userCV: {
            secure_url: { type: String, required: true },
            public_id: { type: String, required: true },
        },
        status: {
            type: String,
            enum: [statusApp.ACCEPTED , statusApp.IN_CONSIDERATION , statusApp.PENDING , statusApp.REJECTED , statusApp.VIEWED],
            default: statusApp.PENDING,
        },
        isDeleted : {type : Boolean , default : false}
    },
    {
    timestamps: true,
    }
)



export const Application = model("Application", applicationSchema)
