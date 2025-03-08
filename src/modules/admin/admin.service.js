import { Company } from "../../db/models/company.model.js";
import { User } from "../../db/models/user.model.js";
import { messages } from "../../utils/index.js";

export const updateUserBanStatus = async (req,res,next) => {
    const { userId } = req.params

    const user = await User.findById(userId)
    if (!user) return next(new Error(messages.user.notFound , {cause : 404} ) )

    if(!user.isBanned){ user.bannedAt = Date.now() }
    else {user.bannedAt = null}
    user.isBanned = !user.isBanned

    await user.save()

    return res.status(200).json({ success: true, message: `User ${user.isBanned ? "banned" : "unbanned"} successfully`, data: user })
}

export const updateCompanyBanStatus = async (req,res,next) => {
    const { companyId} = req.params

    const company = await Company.findById(companyId)
    if (!company) next( new Error(messages.company.notFound , {cause : 404}) )

    if(!company.isBanned){ company.bannedAt = Date.now() }
    else {company.bannedAt = null}
    company.isBanned = !company.isBanned
    await company.save()

    return res.status(200)
    .json({ success: true, message: `Company ${company.isBanned ? "banned" : "unbanned"} successfully`, data: company })
}

export const approveCompany = async (req,res,next) => {
    const { companyId } = req.params

    const company = await Company.findById(companyId)
    if (!company) return next( new Error(messages.company.notFound , {cause : 404}) )
    if (company.isBanned) return next(new Error("The company is banned!" , {cause : 400}))

    company.approvedByAdmin = true
    await company.save()

    return res.status(200).json( { success: true, message: "Company approved successfully", data: company } )
}