import bcrypt from "bcrypt"
export const compareHash = async ({password , hashedPassword}) => {
    return await bcrypt.compare(password , hashedPassword )
}