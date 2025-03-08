import express from 'express'
import bootstrap from './src/app.controller.js'
import './src/utils/otp/deleteExpiredOtp.js'
import { initSocket } from './src/socketIO/index.js'

const app = express()
const port = process.env.PORT || 3000
await bootstrap(app,express)
const server = app.listen(port,(error)=>{
    if(error){
        console.log("error connect server");
    }else{
        console.log("app is listen at port",port);
    }
})

initSocket(server )
