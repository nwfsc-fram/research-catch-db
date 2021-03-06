<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          aria-label="Menu"
        />

        <q-toolbar-title>Research Catch App</q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-2"
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      mini-to-overlay
    >
      <q-list>
        <q-item to="/" exact v-if="isAuthorized(['research-catch-staff','research-catch-user'])">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Home / FAQs</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/permits" v-if="isAuthorized(['research-catch-staff','research-catch-user'])">
          <q-item-section avatar>
            <q-icon name="directions_boat" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Permits</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/grouping-management" v-if="isAuthorized(['research-catch-staff'])">
          <q-item-section avatar>
            <q-icon name="developer_board" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Manage Groupings</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/reports" v-if="isAuthorized(['research-catch-staff'])">
          <q-item-section avatar>
            <q-icon name="assignment" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Reports</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/login">
          <q-item-section avatar>
            <q-icon name="exit_to_app" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Logout</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-footer elevated>
      <q-toolbar>
        <q-space />
        <div class="justify-around">
          For questions related to the functioning of the Research
          Catch App, please contact nmfs.nwfsc.fram.data.team@noaa.gov. For
          the grouping or catch content please contact Kate Richerson
          (kate.e.richerson@noaa.gov) or Kayleigh Somers
          (kayleigh.somers@noaa.gov). For permits
          please contact wcr.gfresearchpermits@noaa.gov.
        </div>
      </q-toolbar>
    </q-footer>

    <q-page-container>
      <router-view ref="child" />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { authService } from '@boatnet/bn-auth/lib';

@Component
// The Vue layout above is also replicated in GroupingManagement.vue
// in order to get beforeRouteLeave to trigger when leaving the
// Grouping management page 
export default class MyLayout extends Vue {
  leftDrawerOpen = false;
  miniState = true;

  private isAuthorized(authorizedRoles: string[]) {
    for (const role of authorizedRoles) {
      if (authService.getCurrentUser()!.roles.includes(role)) {
        return true;
      }
    }
    return false;
  }
}
</script>
