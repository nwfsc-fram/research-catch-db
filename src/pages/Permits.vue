<template>
  <div class="text-center">
    <div class="q-pa-md">
      <q-table
        :data="data"
        :columns="columns"
        row-key="permit_number"
        selection="single"
        :selected.sync="selected"
        :filter="filter"
      >
        <template v-slot:top>
          <q-btn flat dense color="primary" label="Add Permit" to="/permitdetails-user" @click="addRow" />
          <q-btn
            class="on-right"
            flat
            dense
            color="primary"
            to="/permitdetails-user"
            v-if="selected.length !== 0"
            label="Edit row"
            @click="editRow"
          />
          <q-btn
            class="on-right"
            flat
            dense
            color="primary"
            label="Delete row"
            v-if="selected.length !== 0"
            @click="deleteRow"
          />
          <q-space />
          <q-input rounded outlined dense debounce="300" color="primary" v-model="filter">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
      </q-table>
      <div class="q-mt-md">Selected: {{ selected }}</div>
      <div class="q-mt-md">{{ permit }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
//import { State, Action, Getter } from 'vuex-class';
import { State } from 'vuex-class';
import Component from 'vue-class-component';
import { date } from 'quasar';
import axios from 'axios';
import { PermitState } from '../types';

@Component
export default class Permits extends Vue {
  @State('permit') private permit!: PermitState;

  pagination = {
    rowsPerPage: 0
  };
  filter = '';
  selected = [];
  data = [];

  addRow() {
    console.log(this.data);
  }

  editRow() {
    //do another thing
  }

  deleteRow() {
    // Delete the row with the specified permit value
    let jsondata = {'permitNum': this.selected[0].permit_number };
    axios.delete('http://localhost:8080/api/permits/', {data: jsondata});

    // Now that the value is deleted from the DB reload the table
    this.selected = [];
    axios
      .get('http://localhost:8080/api/permitsview')
      .then(response => (this.data = response.data));
  }

  columns = [
    {
      name: 'permitNumber',
      align: 'center',
      label: 'Permit Numbers',
      field: 'permit_number',
      sortable: true
    },
    {
      name: 'organization',
      label: 'Organization',
      field: 'name',
      sortable: true
    },
    { name: 'projectName', label: 'Project Name', field: 'project_name' },
    { name: 'permitYear', label: 'Year', field: 'permit_year' },
    {
      name: 'startDate',
      label: 'Start Date',
      field: 'start_date',
      format: val => date.formatDate(val, 'YYYY-MM-DD')
    },
    {
      name: 'endDate',
      label: 'End Date',
      field: 'end_date',
      sortable: true,
      format: val => date.formatDate(val, 'YYYY-MM-DD')
    },
    {
      name: 'pointOfContact',
      label: 'Point of Contact',
      field: 'poc',
      sortable: true
    },
    {
      name: 'dataStatus',
      label: 'Data',
      field: 'data_status',
      sortable: true
    },
    {
      name: 'deliveryDate',
      label: 'Delivery',
      field: 'delivery_date',
      sortable: true,
      format: val => date.formatDate(val, 'YYYY-MM-DD HH:mm:ss')
    }
  ];

  mounted() {
    axios
      .get('http://localhost:8080/api/permitsview')
      .then(response => (this.data = response.data));
  }
  // .then(response => {console.log(response)}, error => {console.log(error);});
  
  // .then(response => {return const data = response.json(); })
  // .then(data => console.log(data));

  // .then(response => {return const data = response.json(); })
  // .then(data => {const resultArray = []; for (let key in data) {resultArray.push(data[key]);}this.users = resultArray});
}
</script>