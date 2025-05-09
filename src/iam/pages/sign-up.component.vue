<script>
import {useAuthenticationStore} from "../services/authentication.store.js";
import {SignUpRequest} from "../model/sign-up.request.js";

export default {
  name: "sign-up",
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    onSignUp() {
      let authenticationStore = useAuthenticationStore();
      let signUpRequest = new SignUpRequest(this.username, this.password);
      authenticationStore.signUp(signUpRequest, this.$router);
    }
  }
}
</script>

<template>
  <div class="register-container">
    <pv-card class="register-card">
      <template #title>
        <h3>Sign-up</h3>
        <i class="pi pi-user" style="font-size: 32px;"></i>
      </template>
      <template #content>
        <form @submit.prevent="onSignUp">
          <div class="form-group">
            <pv-float-label>
              <label for="username">Username</label>
              <pv-input-text id="username" v-model="username" :class="{'p-invalid': !username}"/>
              <small v-if="!username" class="p-invalid">Username is required</small>
            </pv-float-label>
          </div>
          <div class="form-group">
            <pv-float-label>
              <label for="password">Password</label>
              <pv-input-text id="password" v-model="password" :class="{'p-invalid': !password}" type="password" />
              <small v-if="!password" class="p-invalid">Password is required</small>
            </pv-float-label>
          </div>
          <div class="button-container">
            <button type="submit" class="auth-button">Sign up</button>
          </div>
        </form>
      </template>
    </pv-card>
  </div>
</template>

<style scoped>
.button-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.auth-button {
  background-color: #005f40;
  padding: 10px 20px;
  color: white;
}
</style>