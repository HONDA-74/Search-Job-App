import jwt from 'jsonwebtoken';
import { User } from '../db/models/user.model.js';

export const authenticate =async (authorization) => {
        const token = authorization
        if (!token) {
            throw new Error("token is missing",{cause:401})
        }

        const result = jwt.verify(token , process.env.JWT_SECRET)
        if (result.error) {
            throw result.error
        }

        const authUser = await User.findById(result.userId)
    
        return authUser
}
