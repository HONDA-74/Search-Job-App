

export const generateMessages= (entity) => {
        return {
            notFound : `${entity} not found`,
            alreadyExist : `${entity} already exist`,
            Created : `${entity} created successfully`,
            sent : `${entity} sent successfully`,
            verified : `${entity} verified successfully`,
            found : `${entity} found successfully`,
            Deleted : `${entity} deleted successfully`,
            Freezed : `${entity} freezed successfully`,
            Updated : `${entity} updated successfully`,
            notCreated : `${entity} create failed`,
            notDeleted : `${entity} delete failed`,
            notUpdated : `${entity} update failed`,
            notSent : `${entity} send failed`,
            invalid : `${entity} is invalid` ,
            expired : `${entity} is expired` ,
            notAllowed :`${entity} not allowed` ,
            invalidCrad : `Invalid cradinials`, 
            emailActivate : `Email not activated yet please activate it first and try again`,
            emailVerify : `Email verified successfully`,
            emailAlreadyExist : `Email already exist`,
            notApproved : `${entity} not approved yet`
        }
}

export const messages = {
    user : generateMessages("User"),
    OTP : generateMessages("OTP"),
    IMAGE : generateMessages("Image"),
    company :generateMessages("Company"),
    job : generateMessages("Job"),
    application : generateMessages("Application"),
    chat : generateMessages("Chat")
}