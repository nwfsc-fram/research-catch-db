<template>
  <div class="text-center">
    <div class="q-pa-md">
      <q-table
        :data="data"
        :columns="columns"
        row-key="srp_number"
        selection="single"
        :selected.sync="selected"
        :filter="filter"
      >
        <template v-slot:top>
          <q-btn flat dense color="primary" label="Add row" to="/permitdetails" @click="addRow" />
          <q-btn
            class="on-right"
            flat
            dense
            color="primary"
            to="/permitdetails"
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
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { date } from 'quasar';
import axios from 'axios';

@Component
export default class Permits extends Vue {
  pagination = {
    rowsPerPage: 0
  };
  filter = '';
  selected = [];

  addRow() {
    console.log(this.data);
  }

  editRow() {
    //do another thing
  }

  deleteRow() {
    // Delete the row with the specified SRP value
    let getStr = 'http://localhost:8080/api/delpermits/' + this.selected[0].srp_number;
    axios
      .get(getStr);
    
    // Now that the value is deleted from the DB reload the table
    this.selected = []
    axios
      .get('http://localhost:8080/api/permitsview')
      .then(response => (this.data = response.data));
  }

  columns = [
    {
      name: 'srpNumber',
      align: 'center',
      label: 'SRP Numbers',
      field: 'srp_number',
      sortable: true
    },
    {
      name: 'organization',
      label: 'Organization',
      field: 'name',
      sortable: true
    },
    { name: 'surveyName', label: 'Survey Name', field: 'survey_name' },
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

  data = [];

  mounted() {
    axios
      .get('http://localhost:8080/api/permitsview')
      .then(response => (this.data = response.data));
  }
}
</script>