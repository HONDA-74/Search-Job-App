export const isAuthorized = (...roles) => {
    return (req,res,next) => {
        if (!roles.includes( req.authUser.role ) ) {
            return next(new Error("You are not authorized" , {cause : 401}))
        }

        return next()
    }
}