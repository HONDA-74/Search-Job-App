import jwt from 'jsonwebtoken'
export const generateToken = ({payload , key = process.env.JWT_SECRET , option = {} }) => {
    return jwt.sign(
            payload, 
            key, 
            option 
            )
}