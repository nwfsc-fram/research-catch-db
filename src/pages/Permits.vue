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
        :pagination.sync="pagination"
      >
        <template v-slot:top>
          <q-btn
            flat
            dense
            v-if="poweruser"
            color="primary"
            label="Add Permit"
            to="/permitdetails-staff"
            @click="addRow"
          />
          <q-btn
            class="on-right"
            flat
            dense
            color="primary"
            v-if="selected.length !== 0"
            label="Submit Catch Data"
            @click="editRow"
          />
          <q-btn
            class="on-right"
            flat
            dense
            color="primary"
            label="Delete Permit"
            v-if="(selected.length !== 0) && poweruser"
            @click="confirm = true"
          />
          <q-dialog v-model="confirm" persistent>
            <q-card>
              <q-card-section class="row items-center">
                <q-avatar color="primary" text-color="white" />
                <span class="q-ml-sm">Do you really want to remove the permit entry for {{ permit['permit_number'] }}</span>
              </q-card-section>

              <q-card-actions align="center">
                <q-btn flat label="Confirm" color="primary" @click="deleteRow" v-close-popup />
                <q-btn flat label="Cancel" color="primary" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <q-space />
          <q-input rounded outlined dense debounce="300" color="primary" v-model="filter">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
      </q-table>
      <div class="q-mt-md">Vuex store has: {{ permit }}</div>
      <div class="q-mt-md">Is New: {{ isNew.toString() }}</div>
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
    rowsPerPage: 10,
    sortBy: 'permitYear',
    descending: true
  };
  filter = '';
  // TODO: import typing for this
  selected = [];
  data = [];
  columns : object[] = [];
  confirm = false;
  poweruser = false;

  addRow() {
    // clear vuex store
    this.$store.commit('sPermit/clearSPermit');
    this.$store.commit('sPermit/updateNew', true);
  }

  async editRow() {
    try {
      let output = await axios.post('http://localhost:8080/api/permitid', {'permit_number': this.permit.permit_number})
      this.projectId = output.data[0]['research_project_id']

      if (this.poweruser) {
        this.$router.push('/permitdetails-staff');
      } else {
        this.$router.push('/permitdetails-user');
      }
    } catch (error) {
      console.log('error', error);
      //display some error
    } 
  }

  async deleteRow() {
    // Delete the row with the specified permit value
    let jsondata = { permitNum: this.selected[0].permit_number };
    await axios.delete('http://localhost:8080/api/permits/', { data: jsondata });

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
      { name: 'permitYear', label: 'Year', field: 'permit_year', sortable:true },
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
  set permit(value) {
    this.$store.commit('sPermit/updateSPermit', value);
  }
  get projectId() {
    return this.$store.state.sPermit.permit.research_project_id;
  }
  set projectId(value) {
    this.$store.commit('sPermit/updateProjectId', value);
  }

  //temp
  get isNew() {
    return this.$store.state.sPermit.new;
  }
  set isNew(value) {
    this.$store.commit('sPermit/updateNew', value);
  }

  mounted() {
    axios
      .get('http://localhost:8080/api/permitsview')
      .then(response => (this.data = response.data));
    this.assignColumns();
    this.isNew = false;
  }
  // .then(response => {console.log(response)}, error => {console.log(error);});

  // .then(response => {return const data = response.json(); })
  // .then(data => console.log(data));

  // .then(response => {return const data = response.json(); })
  // .then(data => {const resultArray = []; for (let key in data) {resultArray.push(data[key]);}this.users = resultArray});
}
</script>