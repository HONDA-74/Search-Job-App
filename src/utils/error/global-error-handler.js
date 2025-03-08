import fs from "fs"
import path from "path"

export const globalHandler = (error,req,res,next)=>{
    if(req.file?.path){
        const fullPath =path.resolve(req.file.path)
        
        if(fs.existsSync(fullPath) && 
        req.authUser.profilePic != "uploads/users/defult.jpg")
        { fs.unlinkSync(fullPath) }
    }

    return res.status(error.cause || 500 )
    .json({
        success:false,
        message:error.message,
        stack : error.stack,
    })
}