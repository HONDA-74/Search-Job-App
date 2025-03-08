import multer , {diskStorage} from "multer"

export const cloudUpload = ( types ) => {
    try {
        const storage =diskStorage({})
    
        const fileFilter = (req,file,cb) => {
            if(!types.includes(file.mimetype)){
                cb(new Error("invalid type format") , false )
            }
            cb( null , true )
        }
        return multer({storage , fileFilter })
    } catch (error) {
        console.log(error.message)
    }
}