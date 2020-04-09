<template>
  <div class="q-pa-md q-gutter-md">
    <br>
    <q-card class="q-gutter-md bg-indigo-2">
      <div class="text-subtitle2">
        Welcome to the NWFSC's Research Catch App. To enter your catch data please go to the permit page, linked in the left sidebar.
      </div>
    </q-card>
      
    
    <q-card class="q-gutter-md bg-blue-2">
      <div class="text-h6">FAQs</div>
      <div>
        <p class="text-subtitle2">What are the unid groupings?</p>
        <p>
          Unid grouping categories are for recorded catch that did or could not be categorized 
          into a more specific sub-category. For example, sometimes nearshore rockfish are caught 
          but not recorded under their specific sub-species. In this instance the nearshore rockfish unid 
          category can be used to list this catch.
        </p>
      </div>
    </q-card>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import axios from 'axios';
import { authService } from '@boatnet/bn-auth/lib';

@Component
export default class Reports extends Vue {
  authConfig: object = {};

  mounted() {
    const token = authService.getCurrentUser()!.jwtToken!;
    this.authConfig = { headers: { Authorization: `Bearer ${token}` } };
  }
}
</script>
