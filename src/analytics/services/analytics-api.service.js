import http from "../../shared/services/http-common.js";

export class AnalyticsApiService {

    getZoneAverages() {
        return http.get(`/analytics/zone-averages`);
    }

    getDeviceCounts() {
        return http.get(`/analytics/device-counts`);
    }

    getDeviceLastValues() {
        return http.get(`/analytics/device-last-values`);
    }

    getHistory(zone, deviceId, from, to) {
        return http.get('/analytics/history', {
            params: { zone, deviceId, from, to }
        });
    }

    getDailyAverages(zone, days) {
        return http.get('/analytics/daily-averages', {
            params: { zone, days }
        });
    }

    getDeviceStatus() {
        return http.get(`/analytics/device-status`);
    }

}