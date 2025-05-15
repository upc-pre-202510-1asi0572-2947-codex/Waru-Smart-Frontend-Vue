import http from "../../shared/services/http-common.js";


export class SowingsDevicesApiService {

    async getDevicesBySowingId(sowingId) {
        return await http.get(`/crops-management/sowings/${sowingId}/devices`);
    }

    async addDeviceToSowing(sowingId, deviceData) {
        console.log("URL:", `/crops-management/sowings/${sowingId}/devices`);
        console.log("Datos enviados al servidor:", deviceData);
        return await http.post(`/crops-management/sowings/${sowingId}/devices`, deviceData);
    }

    async getGeneralInformation(sowingId) {
        return await http.get(`/crops-management/sowings/${sowingId}/devices/general-information`);
    }

    async updateDevice(deviceId, deviceData) {
        return await http.put(`/crops-management/sowings/${deviceId}/devices`, deviceData);
    }
}