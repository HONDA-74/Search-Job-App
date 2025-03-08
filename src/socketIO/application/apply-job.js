export const notifyHR = (socket , io ) => {
    return async (data) => {
        const {job,applicantId} = data
        io.to(job.addedBy.toString()).emit("newApplication", { jobId : job.id , applicantId })
    }
}