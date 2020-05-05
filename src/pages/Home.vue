<template>
  <div class="q-pa-md q-gutter-md">
    <br />
    <q-card class="q-gutter-md bg-indigo-2">
      <div>
        <p class="text-subtitle2">
          Welcome to the NWFSC's Research Catch App!
        </p>
        <p>
          To enter your catch data please go to the permit page
          linked in the left sidebar, and click the check box next to the appropriate permit. Then click the 
          "submit catch data" button at the top. You will then be directed to a page with  two tabs, with 
          the catch data tab to the right. For more detailed instructions see below for step by step documentation.
        </p>
        <p>
          The species and management groupings in this database reflect the Pacific Fishery 
          Management Council's groupings in the year the catch occurred. These groupings typically 
          change at least slightly each year, so you may need to update categories to reflect the 
          correct management and species groupings in the database.
        </p>
          If your catch was speciated to a finer level than the groupings included here,
          please combine into the larger category in the database. If a groundfish or shared ecosystem component
          species is not included in the database and a larger category does not fit, please contact
          Kate Richerson (kate.e.richerson@noaa.gov) and Kayleigh Somers (kayleigh.somers@noaa.gov).
        <p>
          
        </p>
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
import { authService } from '@boatnet/bn-auth/lib';

@Component
export default class Home extends Vue {
  authConfig: object = {};

  mounted() {
    const token = authService.getCurrentUser()!.jwtToken!;
    this.authConfig = { headers: { Authorization: `Bearer ${token}` } };
  }
}
</script>
