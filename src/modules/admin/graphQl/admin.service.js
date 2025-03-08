import { Company } from "../../../db/models/company.model.js";
import { User } from "../../../db/models/user.model.js";
import { authenticate } from "../../../graphQl/auth.graphQl.js";
import { isAuthorized } from "../../../graphQl/authorization.graphQl.js";
import { roles } from "../../../utils/global-variables.js";

export const getAllData = async (_, __, context) => {
    const { authorization } = context;
    let authUser = await authenticate(authorization)
    isAuthorized(roles.ADMIN, authUser)

    const users = await User.find()
    const companies = await Company.find()
    
    if (!users.length && !companies.length) {
        throw new Error("No users or companies found");
    }

    return { success: true, data: { users, companies } }
}



