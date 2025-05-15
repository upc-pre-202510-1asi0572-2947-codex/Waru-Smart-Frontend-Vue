import { AuthenticationService } from "./authentication.service.js";
import { defineStore } from "pinia";
import { SignInResponse } from "../model/sign-in.response.js";
import { SignUpResponse } from "../model/sign-up.response.js";

const authenticationService = new AuthenticationService();

export const useAuthenticationStore = defineStore({
    id: 'authentication',
    state: () => ({
        signedIn: localStorage.getItem('token') !== null, // Verifica si hay un token en localStorage
        userId: localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')) : 0, // Obtiene el userId del localStorage
        username: localStorage.getItem('username') || '', // Obtiene el username del localStorage
    }),
    getters: {
        isSignedIn: (state) => state.signedIn,
        currentUserId: (state) => state.userId,
        currentUsername: (state) => state.username,
        currentToken: () => localStorage.getItem('token'),
    },
    actions: {
        async signIn(signInRequest, router) {
            try {
                const response = await authenticationService.signIn(signInRequest);
                const signInResponse = new SignInResponse(response.data.id, response.data.username, response.data.token);

                this.signedIn = true;
                this.userId = signInResponse.id;
                this.username = signInResponse.username;

                localStorage.setItem('token', signInResponse.token);
                localStorage.setItem('userId', signInResponse.id);
                localStorage.setItem('username', signInResponse.username);

                console.log(signInResponse);
                router.push({ name: 'control-panel' });
            } catch (error) {
                console.error(error);
                router.push({ name: 'sign-in' });
            }
        },

        async signUp(signUpRequest, router, redirectRoute = 'control-panel') {
            try {
                const response = await authenticationService.signUp(signUpRequest);
                const signUpResponse = new SignUpResponse(response.data.message);

                console.log(signUpResponse);

                // Llama a signIn y redirige a la ruta especificada
                await this.signIn(signUpRequest, router);
                router.push({ name: redirectRoute });
            } catch (error) {
                console.error(error);
                router.push({ name: 'sign-up' });
            }
        },

        async signOut(router) {
            this.signedIn = false;
            this.userId = 0;
            this.username = '';

            // Limpia todo el localStorage
            localStorage.clear();

            // Redirige al usuario a la página de inicio de sesión
            router.push({ name: 'sign-in' });
        },
    },
});