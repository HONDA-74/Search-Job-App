import { GraphQLObjectType , GraphQLBoolean , GraphQLString, GraphQLList} from "graphql"
import { companyType, userType } from "./admin.type.js"

export const getAllDataResponse =new GraphQLObjectType({
    name : "AllData",
    fields : {
        success : {type : GraphQLBoolean},
        data : {
            type : new GraphQLObjectType({
                name: "DataType",
                fields: {
                    users: { type: new GraphQLList( userType ) },
                    companies: { type: new GraphQLList( companyType ) }
                }
            })
        } 
    }
})