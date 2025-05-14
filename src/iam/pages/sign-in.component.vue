<script>
import {useAuthenticationStore} from "../services/authentication.store.js";
import {SignInRequest} from "../model/sign-in.request.js";

export default {
  name: "sign-in",
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    onSignIn() {
      let authenticationStore = useAuthenticationStore();
      let signInRequest = new SignInRequest(this.username, this.password);
      authenticationStore.signIn(signInRequest, this.$router);
    }
  }
}
</script>

<template>
  <div class="login-container">
    <pv-card class="login-card">
      <template #title>
        <h3>Sign-in</h3>
        <i class="pi pi-user" style="font-size: 32px;"></i>
      </template>
      <template #content>
        <form @submit.prevent="onSignIn">
          <div class="form-group">
            <pv-float-label>
              <label for="username">{{$t('username')}}</label>
              <pv-input-text id="username" v-model="username" :class="{'p-invalid': !username}"/>
              <small v-if="!username" class="p-invalid"> {{$t('usernameRequired')}}</small>
            </pv-float-label>
          </div>
          <br>
          <div class="form-group">
            <pv-float-label>
              <label for="password">{{$t('password')}}</label>
              <pv-input-text id="password" v-model="password" :class="{'p-invalid': !password}" type="password"/>
              <small v-if="!password" class="p-invalid">{{$t('passwordRequired')}}</small>
            </pv-float-label>
          </div>
          <div class="button-container">
            <button type="submit" class="auth-button">{{$t('signIn')}}</button>
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

.login-card{
}

.p-float-label{
  text-align: left;
  display: flex;
  flex-direction: column;
  min-width: 30vw;
}

.p-float-label label{
  margin-top: -1rem;
}

.p-float-label:has(input:focus) label, .p-float-label:has(input.p-filled) label, .p-float-label:has(input:-webkit-autofill) label, .p-float-label:has(textarea:focus) label, .p-float-label:has(textarea.p-filled) label, .p-float-label:has(.p-inputwrapper-focus) label, .p-float-label:has(.p-inputwrapper-filled) label {
    top: 0rem;
    font-size: 12px;
}
</style>