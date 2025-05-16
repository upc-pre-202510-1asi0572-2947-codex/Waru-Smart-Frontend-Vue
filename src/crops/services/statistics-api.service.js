
import http from "../../shared/services/http-common.js";

export class StatisticsApiService {

    getAllSowings(){
        return http.get(`/crops-management/sowings`);
    }

    getCrop(id){
        return http.get(`/crops-management/crops/${id}`);
    }

    getControlsBySowing(sowingId){
        return http.get(`/crops-management/sowings/${sowingId}/controls`);
    }

    getByUserId(userId) {
        return http.get(`/crops-management/sowings/${userId}/user`);
    }

    async getDevicesBySowingId(sowingId) {
        return await http.get(`/crops-management/sowings/${sowingId}/devices`);
    }

    async getAllDevices() {
        return await http.get(`/crops-management/sowings/devices`);
    }

}

