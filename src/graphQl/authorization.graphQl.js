export const isAuthorized = (role,authUser) => {
        if (role != authUser.role ) {
            throw new Error("You are not authorized" , {cause : 401})
        }
}