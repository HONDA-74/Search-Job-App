import bcrypt from "bcrypt"
export const hash= async({password , saltRaounds = 10}) => {
    return await bcrypt.hash(password , saltRaounds )
}