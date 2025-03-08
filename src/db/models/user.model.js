import { Schema , Types, model } from "mongoose";
import { genders , roles , defaultImage , OTPtypes } from "../../utils/global-variables.js";
import { decryptPhone, encryptPhone, hash } from "../../utils/index.js";
import { Company } from "./company.model.js";
import { Chat } from "./chat.model.js";
import { Job } from "./job.model.js";

const otpSchema = new Schema({
    code : { type : String },
    type : {type: String, enum: [OTPtypes.confirmEmail , OTPtypes.forgetPassword] },
    expiresIn : { type : Date , default :() => new Date(Date.now() + 10 * 60 * 1000)}
})

const userSchema = new Schema({
    firstName : {type : String , required: [true , "first name is required"]},
    lastName : {type : String , required: [function ()  {return this.provider=="system"? true : false }  , "lastName is required "]},
    email: { type: String, unique: [true , "email already exits"],
                required: [true , "email is required"]
            },
    password: { type: String,
                required: [function () {return this.provider=="system"? true : false }  , "password is required "],
                minlength: [6, "Password must be at least 6 characters long"]
            },
    phone : {type :String , unique: [true , "phone already exits"],
            required: [function ()  {return this.provider=="system"? true : false }  , "phone is required "],
        },
    gender : {
        type: String, 
        enum: [ genders.FEMALE , genders.MALE ],
    },
    DOB: {
        type: Date,
        required: [function ()  {return this.provider=="system"? true : false }  , "DOB is required "],
        validate: [
            { 
                validator: function (value) {
                    return value < new Date()
                },
                message: "Date of birth must be before today"
            },
            {
                validator: function (value) {
                const ageDiff = new Date().getFullYear() - value.getFullYear()
                return ageDiff > 18
                },
                message: "User must be at least 18 years old."
        }
    ]
        },
    profilePic : { secure_url : {type : String , default : defaultImage.secure_url } ,
                    public_id : {type : String , default :defaultImage.public_id }
                },
    coverPic : { secure_url : {type : String , default : defaultImage.secure_url } ,
                public_id : {type : String , default : defaultImage.public_id }
        },
    provider :{type : String , enum : ["google" , "system"] , default : "system"} ,
    isConfirmed: {type : Boolean , default: false },
    isDeleted : { type : Boolean , default : false},
    deletedAt : { type : Date , default : null} ,
    bannedAt : { type : Date , default : null} ,
    isBanned : {type : Boolean , default : false},
    updatedBy: { type : Types.ObjectId , ref: "User", default: null },
    role: { 
        type: String, 
        enum: [ roles.USER, roles.ADMIN ], 
        default: roles.USER 
    },  
    changeCredentialTime: { type: Date, default: null },
    OTP : [otpSchema]
},
{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

userSchema.virtual("userName").get(function () {
    return `${this.firstName} ${this.lastName}`
})

userSchema.virtual("age").get(function () {
    return new Date().getFullYear() - this.DOB?.getFullYear()
})

userSchema.post("findOne" ,(user)=>{
    if(user){
        if(user.provider == "system"){
        user.phone = decryptPhone(user.phone)
    }
}
})

userSchema.pre(["save"],async function (next) {
    if (this.isModified('password')) {
        this.changeCredentialTime = new Date()
        this.password = await hash({ password: this.password })  
    }

    if(this.provider == "system"){
        if(this.isModified('phone')){
            this.phone = encryptPhone(this.phone)
        }
    }

    if (this.isModified("isDeleted") ) {

        const chats =await Chat.find({users : {$in : [ this._id ] }})
        if( chats.length > 0 )
            for (const chat of chats) {
                chat.isDeleted = this.isDeleted
                if(!this.isDeleted)  chat.deletedAt = Date.now()
                else chat.deletedAt = null
                await chat.save() 
            }

        const companies = await Company.find({ createdBy: this._id })
        if( companies.length > 0 )
        for (const company of companies) {
            company.isDeleted = this.isDeleted
            if(this.isDeleted)  company.deletedAt = Date.now()
            else company.deletedAt = null
            await company.save() 
        }

        const jobs = await Job.find({ addedBy : this._id })
        if( jobs.length > 0 )
        for (const job of jobs) {
            job.isDeleted = this.isDeleted
            if(!this.isDeleted)  job.deletedAt = Date.now()
            else job.deletedAt = null

            await job.save() 
        }
        
        await Company.updateMany({ HRs:{$in: [ this._id ]}}, { $pull: { HRs: this._id } })
    }

    next()
})

userSchema.pre("findOneAndUpdate", async function (next) {
    let updateData = this.getUpdate()
    if (!updateData) return next()

    if (updateData.password) {
        updateData.changeCredentialTime = new Date()
        updateData.password = await hash({ password: updateData.password })
    }
    if (updateData.phone) {
        updateData.phone = encryptPhone(updateData.phone)
    }

    this.setUpdate(updateData)
    next()
})

export const User = model("User" , userSchema )

