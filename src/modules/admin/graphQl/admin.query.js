import { getAllDataResponse } from "./admin.response.js";
import { getAllData } from "./admin.service.js";

export const adminQuery = {
    getAllData: {
        type: getAllDataResponse,
        resolve: getAllData
    }
}
