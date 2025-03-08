import cron from "node-cron";
import { User } from "../../db/models/user.model.js";


const deleteExpiredOtps = async () => {
    try {
        const now = new Date()
        
        const result = await User.updateMany(
            {}, 
            { $pull: { OTP: { expiresIn: { $lt: now } } } }
        )

        console.log(`[CRON JOB] Deleted expired OTPs at ${now}. Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`)
    } catch (error) {
        console.error("[CRON JOB] Error deleting expired OTPs:", error.message)
    }
}

cron.schedule("0 */6 * * *", deleteExpiredOtps)

export default deleteExpiredOtps
