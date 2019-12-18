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
        @selection="newSelection"
      >
        <template v-slot:top>
          <q-btn
            flat
            dense
            v-if="poweruser"
            color="primary"
            label="Add Permit"
            to="/permitdetails-user"
            @click="addRow"
          />
          <q-btn
            class="on-right"
            flat
            dense
            color="primary"
            :to="permitDetailsPage"
            v-if="selected.length !== 0"
            label="Edit Permit"
          />
          <q-btn
            class="on-right"
            flat
            dense
            color="primary"
            label="Delete Permit"
            v-if="(selected.length !== 0) && poweruser"
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
      <div class="q-mt-md">Vuex store has: {{ permit }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
//import { State, Action, Getter } from 'vuex-class';
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
  data = [];
  columns = [];
  poweruser = true;

  addRow() {
    console.log(this.data);
  }

  deleteRow() {
    // Delete the row with the specified permit value
    let jsondata = { permitNum: this.selected[0].permit_number };
    axios.delete('http://localhost:8080/api/permits/', { data: jsondata });

    // Now that the value is deleted from the DB reload the table
    this.selected = [];
    axios
      .get('http://localhost:8080/api/permitsview')
      .then(response => (this.data = response.data));
  }

  newSelection(details) {
    if (details.added) {
      this.$store.commit('sPermit/updateSPermit', details.rows[0]);
    }
  }

  assignColumns() {
    this.columns = [
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
        field: 'organization_name',
        sortable: true
      },
      { name: 'projectName', label: 'Project Name', field: 'project_name' },
      { name: 'permitYear', label: 'Year', field: 'permit_year' },
      {
        name: 'principleInvestigator',
        label: 'Principle Investigator',
        field: 'principle_investigator',
        sortable: true
      },
      {
        name: 'pointOfContact',
        label: 'Point of Contact',
        field: 'point_of_contact',
        sortable: true
      },
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
        name: 'dataStatus',
        label: 'Data',
        field: 'data_status',
        sortable: true
      },
      {
        name: 'deliveryDate',
        label: 'Delivery Date',
        field: 'delivery_date',
        sortable: true,
        format: val => date.formatDate(val, 'YYYY-MM-DD HH:mm:ss')
      }
    ];

    if (this.poweruser) {
      this.columns.push(
        {
          name: 'moratalityCredits',
          label: 'Mortality Credits Applicable',
          field: 'mortality_credits_applicable',
          sortable: true
        },
        {
          name: 'dataStatus',
          label: 'Data Status',
          field: 'data_status',
          sortable: true
        },
        {
          name: 'issuedBy',
          label: 'Issued By',
          field: 'issued_by',
          sortable: true
        },
        {
          name: 'staffNotes',
          label: 'Staff Notes',
          field: 'staff_notes',
          sortable: true
        }
      );
    }
  }

  get permit() {
    return this.$store.state.sPermit.permit;
  }

  get permitDetailsPage() {
    if (this.poweruser) {
      return '/permitdetails-staff';
    } else {
      return '/permitdetails-user';
    }
  }

  mounted() {
    axios
      .get('http://localhost:8080/api/permitsview')
      .then(response => (this.data = response.data));
    this.assignColumns();
  }
  // .then(response => {console.log(response)}, error => {console.log(error);});

  // .then(response => {return const data = response.json(); })
  // .then(data => console.log(data));

  // .then(response => {return const data = response.json(); })
  // .then(data => {const resultArray = []; for (let key in data) {resultArray.push(data[key]);}this.users = resultArray});
}
</script>