export const validation = (schema , data) => {
        const result = schema.validate(data , {abortEarly: false})
        if(result.error){
            let messages = result.error.details.map( (obj) => obj.message )
            throw new Error(messages , {cause : 400})
        }
}



