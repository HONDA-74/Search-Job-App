import { Chat } from "../../db/models/chat.model.js"
import { Company } from "../../db/models/company.model.js"

export const sendMessage =  (socket , io ) => {
    return async (data) => {
        try {
            
            const {message , destId} = data
            const chat =await Chat.findOne({users : {$all : [destId , socket.id]}})
            if(chat){
                chat.updateOne({$push : {messages : {sender : socket.id , receiver : destId , message }}})
            }else{
                const company = await Company.findOne({ $or: [ { HRs: { $in: [socket.id] } } , { createdBy: socket.id } ] })
                if (!company) {
                    console.log("error");
                    return socket.emit("error", { message: "Only HRs or Company Owners can start a chat." })
                }
                socket.to(destId).emit("receiveMessage" , { message } )
                
                await Chat.create({
                    users : [destId , socket.id] ,
                    messages : [{sender : socket.id , receiver : destId , message }]
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
}

