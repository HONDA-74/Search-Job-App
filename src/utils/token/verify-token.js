import jwt from 'jsonwebtoken'
export const verifyToken = ({token , key = process.env.JWT_SECRET}) => {
    try {
        return jwt.verify(token , key )
    } catch (error) {
        return { error }
    }
}