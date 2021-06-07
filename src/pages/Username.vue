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

        <q-dialog v-model="showDialog">
          <q-card>
            <q-card-section>
              <div class="text-h6">Password email sent</div>
            </q-card-section>
            <q-card-section class="row items-center">
              <span class="q-ml-sm">In a few minutes you will receive an email containing a link to set your password</span>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Okay" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
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

  private async handleSubmit() {
    const resetPasswordURL = window.origin + "/#/password?username=" + this.username;
    const usernamePage = window.origin + "/#/username";
    this.showDialog = true;

    const appName: string = 'Research Catch';
    const appShortName = 'BOATNET_OBSERVER';

    await authService.sendPasswordResetEmail(this.username, appName, appShortName,
      resetPasswordURL, usernamePage);
  }

}
</script>
