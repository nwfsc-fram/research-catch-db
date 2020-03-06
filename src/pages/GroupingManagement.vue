<template>
  <div>
    <br />
    <div class="q-gutter-md row justify-center">
      <q-select outlined v-model="year" :options="temp_years" label="Year" stack-label dense />
      <q-btn color="primary" label="Add New Year" />
    </div>
    <br>
    <q-separator color="primary" />
    <br>
    <q-table :data="groupingList" :columns="columnsA" title="Grouping" row-key="name">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td
            key="grouping"
            :props="props"
          >
            {{ props.row.grouping_name }}
            <q-popup-edit v-model="props.row.grouping_name" buttons @save="updateGrouping">
              <q-input v-model="props.row.grouping_name" dense autofocus />
            </q-popup-edit>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <div> {{ groupingList }} </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
//import { State, Action, Getter } from 'vuex-class';
import Component from 'vue-class-component';
import axios from 'axios';
import { authService } from '@boatnet/bn-auth/lib';

@Component
export default class GroupingManagement extends Vue {
  data = [];
  groupingList = [];
  year = 9999;
  temp_years = [2019, 2020];
  authConfig: object = {};

  columnsA = [
    {
      name: 'grouping',
      label: 'Grouping',
      field: 'grouping_name',
      sortable: true
    }
  ];

  // things for extensions
  // pull out grouping year list
  // get unique groupings by year from grouping_species list

  //create new year for new next missing, copy prior years entries as starting point
  addNewYear() {
    // do a thing
  }

  updateGrouping(value, initialValue) {
    console.log(value,' and ',initialValue);
  }

  mounted() {
    const token = authService.getCurrentUser()!.jwtToken!;
    this.authConfig = { headers: { Authorization: `Bearer ${token}` } };
    axios
      .get('rcat/api/v1/permitsview', this.authConfig)
      .then(response => (this.data = response.data));
    // temp, update this to pull current year
    this.year = 2019;
    axios
      .get('rcat/api/v1/grouping', this.authConfig)
      .then(response => (this.groupingList = response.data))
      .catch(error => {
        console.log(error.response);
      });
  }
}
</script>