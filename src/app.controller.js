import { connectDB } from "./db/connection.js"
import authRouter from "./modules/auth/auth.controller.js"
import userRouter from "./modules/user/user.controller.js"
import companyRouter from "./modules/company/company.controller.js"
import jobRouter from "./modules/job/job.controller.js"
import adminRouter from "./modules/admin/admin.controller.js"
import chatROuter from "./modules/chat/chat.controller.js"
import appRouter from "./modules/application/app.controller.js"
import { globalHandler } from "./utils/error/global-error-handler.js"
import { invalidUrl } from "./utils/error/not-found-url.js"
import { schema } from "./app.schema.js"
import cors from "cors"
import { createHandler } from "graphql-http/lib/use/express"
import {rateLimit} from "express-rate-limit"
import helmet from "helmet"

const bootstrap = async (app , express) =>{
    app.use(rateLimit({
        windowMs : 2*60*1000,
        limit : 10,
        legacyHeaders : false
    }))

    app.use(helmet())

    await connectDB()

    app.use(cors({ origin: '*' }))

    app.use(express.json())

    app.all("/graphql" , createHandler({ schema , context : (req)=>{
        const {authorization} = req.headers
        return {authorization} 
    }}))

    app.use("/auth" , authRouter )

    app.use("/user" , userRouter)

    app.use("/company" , companyRouter )

    app.use("/job" , jobRouter)

    app.use("/admin" , adminRouter )

    app.use("/chat" , chatROuter)

    app.use("/application" , appRouter)

    app.all("*" , invalidUrl )

    app.use( globalHandler )
}
export default bootstrap