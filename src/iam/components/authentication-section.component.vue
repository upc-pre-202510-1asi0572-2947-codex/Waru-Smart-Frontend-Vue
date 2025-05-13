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
    <div v-else class="auth-buttons-container">
      <pv-button
          v-if="isSignInPage"
          class="auth-button"
          @click="onSignUp"
      >{{$t('signUp')}}</pv-button>
      <pv-button
          v-if="isSignUpPage"
          class="auth-button"
          @click="onSignIn"
      >{{$t('signIn')}}</pv-button>
    </div>
  </div>
</template>

<script>
import { useAuthenticationStore } from "../services/authentication.store.js";
import { useRouter } from "vue-router";

export default {
  name: "authentication-section",
  data() {
    return {
      router: useRouter(),
      authenticationStore: useAuthenticationStore(),
      dropdownOpen: false,
    };
  },
  computed: {
    isSignedIn() {
      return this.authenticationStore.isSignedIn;
    },
    currentUsername() {
      return this.authenticationStore.currentUsername;
    },
    isSignInPage() {
      return this.$route.name === "sign-in";
    },
    isSignUpPage() {
      return this.$route.name === "sign-up";
    },
  },
  methods: {
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    closeDropdown() {
      this.dropdownOpen = false;
    },
    onSignIn() {
      this.router.push({ name: "sign-in" });
    },
    onSignUp() {
      this.router.push({ name: "sign-up" });
    },
    onSignOut() {
      this.authenticationStore.signOut(this.router);
    },
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.closeDropdown();
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
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

.auth-buttons-container {
  display: flex;
  gap: 1rem; /* Espaciado entre los botones */
}

.auth-button {
  background-color: #fff; /* Fondo blanco */
  color: #3E7C59; /* Letra verde */
  border: 1px solid #3E7C59; /* Borde verde */
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  font-size: 1rem;
}

.auth-button:hover {
  background-color: #3E7C59;
  color: #fff;
  border: 1px solid #fff;
}
</style>