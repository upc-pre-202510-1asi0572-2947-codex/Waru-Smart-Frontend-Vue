<template>
  <div>
    <div v-if="isSignedIn" class="dropdown">
      <span class="p-button" @click="toggleDropdown">
        Welcome, {{ currentUsername }}
        <i class="pi pi-chevron-down" style="margin-left: 0.5rem;"></i>
      </span>
      <div v-if="dropdownOpen" class="dropdown-menu">
        <pv-button class="sign-out-button" @click="onSignOut">Sign Out</pv-button>
      </div>
    </div>
    <div v-else>
      <pv-button class="auth-button" @click="onSignIn">Sign In</pv-button>
      <pv-button class="auth-button" @click="onSignUp">Sign Up</pv-button>
    </div>
  </div>
</template>

<script>
import {useAuthenticationStore} from "../services/authentication.store.js";
import {useRouter} from "vue-router";

export default {
  name: "authentication-section",
  data() {
    return {
      router: useRouter(),
      authenticationStore: useAuthenticationStore(),
      dropdownOpen: false, // Estado para controlar el desplegable
    };
  },
  computed: {
    isSignedIn() {
      return this.authenticationStore.isSignedIn;
    },
    currentUsername() {
      return this.authenticationStore.currentUsername;
    },
  },
  methods: {
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen; // Alternar el estado del desplegable
    },
    onSignIn() {
      this.router.push({name: "sign-in"});
    },
    onSignUp() {
      this.router.push({name: "sign-up"});
    },
    onSignOut() {
      this.authenticationStore.signOut(this.router);
    },
  },
};
</script>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
}

.p-button {
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: #fff;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  border: 1px solid #ccc;
  padding: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.sign-out-button {
  color: #333;
  border: 1px solid #ccc;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.auth-button {
  color: #fff;
  background-color: #3E7C59;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.auth-button:hover {
  background-color: #2e5a43;
}
</style>