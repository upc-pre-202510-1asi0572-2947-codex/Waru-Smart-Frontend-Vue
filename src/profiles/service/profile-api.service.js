import http from "../../shared/services/http-common.js";

export class ProfileApiService {

    create(model) {
        return http.post(`/profiles`, model);
    }
    update(id, model) {
        return http.put(`/profiles/${id}`, model);
    }

    getProfileById(id){
        return http.get(`/profiles/${id}`)
    }

    getUserProfileById(userId) {
        return http.get(`/profiles/${userId}/user`);
    }

    updateProfile(profileId, model) {
        return http.put(`/profiles/${profileId}`, model);
    }
}
export default new ProfileApiService();