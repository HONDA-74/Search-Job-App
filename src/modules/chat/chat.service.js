import { Chat } from "../../db/models/chat.model.js"
import { messages } from "../../utils/index.js"

export const getChat =async (req , res , next) => {
    const {userId} = req.body
    
    const chat = await Chat.findOne({users : {$all : [req.authUser._id , userId ]}})

    if(!chat) return next(new Error(messages.chat.notFound , {cause : 404}))

    return res.status(200).json({success : true , data : chat})
}

export const deleteChat = async (req ,res ,next) => {
    const {id} = req.params

    const chat = await Chat.findById(id)

    if(!chat) return next(new Error(messages.chat.notFound , { cause : 404 }))

    if(!chat.users.includes(req.authUser._id)) return next(new Error(messages.user.notAllowed , {cause : 403}))

    chat.isDeleted = true
    await chat.save()

    return res.status(200).json({success : true , message : messages.chat.Deleted })
}