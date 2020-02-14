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

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered content-class="bg-grey-2">
      <q-list>
        <q-item to="/permits" exact>
          <q-item-section avatar>
            <q-icon name="directions_boat" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Permits</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://quasar.dev">
          <q-item-section avatar>
            <q-icon name="assignment" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Reports</q-item-label>
            <q-item-label caption>quasar.dev</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://quasar.dev">
          <q-item-section avatar>
            <q-icon name="developer_board" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Manage Groupings</q-item-label>
            <q-item-label caption>quasar.dev</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-footer elevated>
      <q-toolbar>
        <q-space />
      <div class="justify-around">
        For questions or bug reports related to the functioning of the Research
        Catch App, please contact nmfs.nwfsc.fram.data.team@noaa.gov. For questions
        about the scientific, catch, or permit content of the Research Cath App
        please contact Kate Richerson (kate.e.richerson@noaa.gov) or
        Kayleigh Somers (kayleigh.somers@noaa.gov)
      </div>
      </q-toolbar>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class MyLayout extends Vue {
  leftDrawerOpen = false;
}
</script>
