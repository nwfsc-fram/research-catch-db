<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="absolute-center"  style="width: 100%;">
      <div class="q-pa-sm column justify-center items-center full-height" style="margin-top: 150px">
        <q-form class="q-gutter-xs" style="width: 100%; max-width: 500px" @submit="handleSubmit">
          <div class="q-ma-md" style="text-align: center">
            <img alt="noaa logo" src="../assets/NOAA_logo.svg" style="height: 80px">
              &nbsp;
              <div
                class="text-h6 text-primary"
                style="font-size: 24px; display: inline; line-height: 80px; vertical-align: top"
              >
                Enter username
              </div>
            <br><br>
          </div>

          <q-input
                outlined
                ref="username"
                v-model="username"
                dense
                autocorrect="off" autocapitalize="off" spellcheck="false"
                label="Username"/>
            <div style="color: green">{{resultMessage}}</div>
            <div style="text-align: center">
              <q-btn
                class="full-width"
                color="primary"
                label="Submit"
                dense
                type="submit"
                align="center"
              />
            </div>
        </q-form>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
// https://github.com/kaorun343/vue-property-decorator

import Vue from 'vue';
import Component from 'vue-class-component';
import { authService } from '@boatnet/bn-auth/lib';

@Component
export default class Username extends Vue {

  private username = '';
  private showDialog = false;
  private resultMessage: string = '';

  private async handleSubmit() {
    const resetPasswordURL = window.origin + window.location.pathname + "#/password?username=" + this.username;
    const usernamePage = window.origin + window.location.pathname + "#/username";
    this.showDialog = true;

    const appName: string = 'Research Catch';
    const appShortName = 'BOATNET_OBSERVER';

    try {
      await authService.sendPasswordResetEmail(this.username, appName, appShortName,
        resetPasswordURL, usernamePage);
    } catch (error) {
      console.log(error)
    }
    this.resultMessage = 'In a few minutes you will receive an email containing a link to set/reset your password';
  }

}
</script>
