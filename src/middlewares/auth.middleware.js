import jwt from 'jsonwebtoken';
import { User } from '../db/models/user.model.js';

export const authenticate =async (req, res, next) => {
    try {
        const token = req.headers.accesstoken;
        if (!token) {
            return next(new Error("Access token is missing",{cause:401}))
        }

        const result = jwt.verify(token , process.env.JWT_SECRET)
        if (result.error) {
            return next(result.error)
        }

        const existUser = await User.findById(result.userId)
        
        if(existUser.isDeleted == true ){
            return next(new Error("Your account is freezed, Login first" , { cause : 400 }))
        }

        if(existUser.isBanned == true ){
            return next(new Error("Your account is banned" , { cause : 400 }))
        }

        if(existUser.bannedAt?.getTime() > result.iat*1000 ){
            return next(new Error("Destroyed token" , { cause : 400 }))
        }

        if(existUser.deletedAt?.getTime() > result.iat*1000 ){
            return next(new Error("Destroyed token" , { cause : 400 }))
        }

        const tokenIssuedAt = new Date(result.iat * 1000)
        if (existUser.changeCredentialTime && tokenIssuedAt < existUser.changeCredentialTime) {
            return next (new Error("Password has been updated. Please log in again" , {cause : 403}))
        }

        req.authUser = existUser

        next()
    } catch ( error ) {
        return next( error )
    }
}
