<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="absolute-center"  style="width: 100%;">
      <div class="q-pa-sm column justify-center items-center full-height" style="margin-top: 150px">
        <q-form ref="passwordForm" class="q-gutter-xs" style="width: 100%; max-width: 500px">
          <div class="q-ma-md" style="text-align: center">
            <img alt="noaa logo" src="../assets/NOAA_logo.svg" style="height: 80px">
              &nbsp;
              <div
                class="text-h6 text-primary"
                style="font-size: 24px; display: inline; line-height: 80px; vertical-align: top"
              >
                Set/Reset Password
              </div>
            <br><br>
          </div>

            <q-input
                outlined
                ref="password"
                :type="isPwd ? 'password' : 'text'"
                v-model="password1"
                label="Password"
                dense
                hint="Min 12 characters"
                autocorrect="off" autocapitalize="off" spellcheck="false"
                :rules="[ val => val.length >= 12 || 'Please use minimum 12 characters' ]"
            >
                <template v-slot:append>
                <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                />
                </template>
            </q-input>
            <q-input
                outlined
                ref="password"
                :type="isPwd ? 'password' : 'text'"
                v-model="password2"
                label="Confirm Password"
                dense
                error-message="Passwords must match"
                :error="!isValid"
            >
                <template v-slot:append>
                <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                />
                </template>
          </q-input>
            <div>Password rules</div>
          <ul>
              <li>12 characters</li>
              <li>No words</li>
          </ul>
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

@Component
export default class Password extends Vue {

  private password1 = '';
  private password2 = '';
  private isPwd = true;

  // TODO implement password validation rules
  get isValid() {
      return this.password1 === this.password2;
  }

}
</script>
