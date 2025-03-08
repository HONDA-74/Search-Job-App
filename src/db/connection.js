import mongoose from "mongoose";
export const connectDB = async () =>{
    await mongoose.connect(process.env.DB_URL)
    .then(()=>{
        console.log("DataBase connected successfully. ");
    })
    .catch((error)=>{
        console.log("error connecting Database : " , error.message );
    })
}