import { Schema , Types, model } from "mongoose"

const messageSchema = new Schema({
    receiver : { type : Types.ObjectId , ref : "User" , required : true},
    sender : { type : Types.ObjectId , ref : "User" , required : true},
    message : { type : String , required : true },
},
{
    timestamps : true 
}
)

const chatSchema = new Schema(
    {
        users : [{type : Types.ObjectId , ref : "User" , required : true}],
        messages : [ messageSchema ],
        isDeleted : {type : Boolean , default : false}
    },
    {
        timestamps : true 
    }
) 

export const Chat = model("Chat" , chatSchema)