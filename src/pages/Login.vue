<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="absolute-center"  style="width: 100%;">
      <div class="q-pa-sm column justify-center items-center full-height" style="margin-top: 150px">
        <q-form @submit.prevent.stop="handleSubmit" class="q-gutter-xs" style="width: 100%; max-width: 500px">
          

              <div class="q-ma-md" style="text-align: center">
                <img alt="noaa logo" src="../assets/NOAA_logo.svg" style="height: 80px">
                &nbsp;
                <div class="text-h6 text-primary" style="font-size: 24px; display: inline; line-height: 80px; vertical-align: top">Research Catch</div>
                <br><br>
              </div>

          <q-input
            outlined
            ref="username"
            v-model="username"
            dense
            autocorrect="off" autocapitalize="off" spellcheck="false"
            label="Username"/>

          <q-input
            outlined
            ref="password"
            :type="isPwd ? 'password' : 'text'"
            v-model="password"
            label="Password"
            dense
            autocorrect="off" autocapitalize="off" spellcheck="false"
            autocomplete="boatnet password"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <div style="text-align: center">
            <q-btn
              class="full-width"
              color="primary"
              :disable="!password || !username"
              label="Login"
              dense
              type="submit"
              align="center"
            />
          </div>
        </q-form>
        <br>
        <div class="column justify-center" style="text-align: center">
          <router-link to="/" disabled="true">Forgot Password</router-link>
          <router-link to="/" disabled="true">Change Password</router-link>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
// https://github.com/kaorun343/vue-property-decorator

import Vue from 'vue';
import Component from 'vue-class-component';
import { authService } from '@boatnet/bn-auth';

// Swiped this from boatnet login pages
@Component
export default class Login extends Vue {

  private error = '';
  private username = '';
  private password = '';
  private isPwd = true;
  private submitted = false;

  private visible = false;
  private layout = 'normal';
  private input = null;
  private options = {
    useKbEvents: false,
    preventClickEvent: false
  };

  private unsubscribe;

  public get isLoggingIn(): boolean {
    const isLoggingIn = !!this.$store.state.auth.status.isLoggingIn;
    return isLoggingIn;
  }

  // public get isLoggedIn(): boolean {
  //   const isLoggedIn = !!this.$store.state.auth.status.isLoggedIn;
  //   return false;
  // }

  private onUrlChange(newVal: string, oldVal: string) {
    console.log('URL CHANGED', newVal, oldVal);
  }

  private show(e) {
    this.input = e.target;
    this.layout = e.target.dataset.layout;

    if (!this.visible) {
      this.visible = true;
    }
  }

  private hide() {
    this.visible = false;
  }

  private isAuthorized(authorizedRoles: string[]) {
    for (const role of authorizedRoles) {
      if (authService.getCurrentUser()!.roles.includes(role)) {
        return true;
      }
    }
    return false;
  }

  private mounted() {
    // this.refreshPage();
    this.$store.dispatch('auth/logout'); // reset login status
    console.log('I am logged out now');

    this.unsubscribe = this.$store.subscribe((mutation) => {
      switch (mutation.type) {
        case 'auth/loginSuccess':
          if (this.isAuthorized(['research-catch-staff','research-catch-user'])) {
            this.$router.push('/'); // On successful login, navigate to home
          }
          else {
            this.$q.notify({
              message:
                'Account not authorized for Research Catch Application',
              color: 'red'
            });
          }
          break;
        case 'auth/loginFailure':
          // todo: give user error when login fails
          this.$q.notify({
            message:
              'Login Failed',
            color: 'red'
          });
          break;
      }
    });
  }

  private beforeDestroy() {
    this.unsubscribe();
  }

  private handleSubmit() {
    this.submitted = true;
    const { username, password } = this;
    if (username && password) {
      this.$store.dispatch('auth/login', { username: username, password:password});
    }
  }

}
</script>
