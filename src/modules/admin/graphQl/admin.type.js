import { GraphQLBoolean, GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

export const userType =new GraphQLObjectType({
    name : "User",
    fields : {
        id : {type : GraphQLID},
        userName : {type : GraphQLString},
        phone : {type : GraphQLString},
        email : {type : GraphQLString},
        gender : {type : GraphQLString},
        DOB : {type : GraphQLString},

    }
})

export const companyType =new GraphQLObjectType({
    name : "Company",
    fields : {
        id : {type : GraphQLID},
        companyName : {type : GraphQLString},
        companyEmail : {type : GraphQLString},
        approvedByAdmin : {type : GraphQLBoolean}
    }
})