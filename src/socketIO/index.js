import { Server } from "socket.io";
import { sendMessage } from "./chat/index.js";
import { authSocket } from "./middlewares/auth.socket.js";
import { notifyHR } from "./application/apply-job.js";



export const initSocket = (server )=>{
    const io = new Server(server , {cors : {origin : "*"}})

    io.use(authSocket)


    io.on("connection", (socket)=>{

        socket.on("sendMessage" , sendMessage( socket , io ) )

        socket.on("applyToJob" , notifyHR(socket , io) )
    })
}
