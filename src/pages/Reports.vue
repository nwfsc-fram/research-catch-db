<template>
  <div>
    <br />
    <div class="row justify-around">
      <q-select
        outlined
        v-model="startYearModel"
        :options="yearList"
        label="Start Year"
        stack-label
      />
      <q-select
        outlined
        v-model="endYearModel"
        :options="yearList"
        label="End Year"
        stack-label
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import axios from 'axios';
import { authService } from '@boatnet/bn-auth/lib';

@Component
export default class Reports extends Vue {
  startYearModel: number = 2019;
  endYearModel: number = 2019;
  yearList: number[] = [];
  authConfig: object = {};

  mounted() {
    const token = authService.getCurrentUser()!.jwtToken!;
    this.authConfig = { headers: { Authorization: `Bearer ${token}` } };
    axios
      .get('rcat/api/v1/groupmanage', this.authConfig)
      .then(response => (this.yearList = response.data.map(a => a.year)))
      .catch(error => {
        console.log(error.response);
      });
  }
}
</script>
