import XLSX from "xlsx";
import fs from "fs";
import path from "path";
import { Application } from "../../db/models/application.model.js"; 

export const applicationsToExcel = async (req, res, next) => {
        const { companyId } = req.query
        const { date  } = req.body 

        const startDate = new Date(date)
        startDate.setHours(0, 0, 0, 0)

        const endDate = new Date(date)
        endDate.setHours(23, 59, 59, 999)

        const applications = await Application.find({
            companyId,
            createdAt: { $gte: startDate, $lte: endDate },
        }).populate("userId jobId")

        if (applications.length == 0) {
            return next(new Error("No applications found for the given date" , {cause : 404}))
        }

        const data = applications.map(app => ({
            "Applicant Name": app.userId?.userName || "Unknown",
            "Email": app.userId?.email || "Unknown",
            "Job Title": app.jobId?.jobTitle || "Unknown",
            "Application Date": app.createdAt.toISOString(),
            "Status": app.status || "Pending",
        }))

        const workbook = XLSX.utils.book_new()
        const worksheet = XLSX.utils.json_to_sheet(data)
        XLSX.utils.book_append_sheet(workbook, worksheet, "Applications")

        const filePath = path.join("exports", `applications_${date}.xlsx`)
        fs.mkdirSync("exports", { recursive: true })

        XLSX.writeFile(workbook, filePath, { bookType: "xlsx", type: "buffer" })

        res.status(200).json({success:true , data , filePath})
}
