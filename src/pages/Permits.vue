<template>
  <div class="text-center">
    <br />
    <div>Check a box on the left hand side of the table below to view/edit a permit.</div>

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
        summary="This table lists the permit numbers and information associated with permit." 
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
            :disable="selected.length === 0"
            :label="editButtonText"
            @click="editRow"
          />
          <q-btn
            class="on-right"
            flat
            dense
            color="primary"
            label="Delete Permit"
            v-if="poweruser"
            :disable="selected.length === 0"
            @click="confirm = true"
          />
          <q-dialog v-model="confirm" persistent>
            <q-card>
              <q-card-section class="row items-center">
                <q-icon name="delete_forever" color="primary" size="56px" />
                <span
                  class="q-ml-sm"
                >Do you really want to remove the permit entry for {{ permit['permit_number'] }}</span>
              </q-card-section>

              <q-card-actions align="center">
                <q-btn flat label="Confirm" color="primary" @click="deleteRow" v-close-popup />
                <q-btn flat label="Cancel" color="primary" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <q-space />
          <q-input rounded outlined dense debounce="300" color="primary" v-model="filter">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
      </q-table>
    </div>

    <div>{{ selected }}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
//import { State, Action, Getter } from 'vuex-class';
import Component from 'vue-class-component';
import { date } from 'quasar';
import axios from 'axios';
import { authService } from '@boatnet/bn-auth/lib';

interface SelectedRow { 
  'permit_number': string, 
  'organization_name': string, 
  'project_name': string, 
  'permit_year': number, 
  'start_date': string, 
  'end_date': string, 
  'mortality_credits_applicable': boolean | null, 
  'point_of_contact': string | null, 
  'data_status': string, 
  'delivery_date': string | null, 
  'issued_by': string | null, 
  'principle_investigator': string | null, 
  'notes': string | null, 
  'staff_notes': string | null 
}

@Component
export default class Permits extends Vue {
  pagination = {
    rowsPerPage: 10,
    sortBy: 'permitYear',
    descending: true
  };
  filter = '';
  // TODO: import typing for this
  selected: SelectedRow[] = [];
  data = [];
  columns: object[] = [];
  confirm = false;
  authConfig: object = {};
  poweruser = authService.getCurrentUser()!.roles.includes('research-catch-staff');

  addRow() {
    // clear vuex store
    this.$store.commit('sPermit/clearSPermit');
    this.$store.commit('sPermit/updateNew', true);
  }

  async editRow() {
    try {
      let output = await axios.get(
        'rcat/api/v1/permitid/' + this.permit.permit_number, this.authConfig
      );
      this.projectId = output.data[0]['research_project_id'];

      if (this.poweruser) {
        this.$router.push('/permitdetails-staff');
      } else {
        this.$router.push('/permitdetails-user');
      }
    } catch (error) {
      console.log(error.response);
      //display some error
    }
  }

  async deleteRow() {
    try {
      // Delete the row with the specified permit value
      await axios.delete(
        'rcat/api/v1/permits/' + this.selected[0].permit_number,
        this.authConfig
      );

      // Now that the value is deleted from the DB reload the table
      this.selected = [];
      axios
        .get('rcat/api/v1/permitsview', this.authConfig)
        .then(response => (this.data = response.data));
    } catch (error) {
      console.log(error.response);
    }
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
        headers: 'permit_number',
        sortable: true
      },
      {
        name: 'organization',
        label: 'Organization',
        field: 'organization_name',
        sortable: true
      },
      { name: 'projectName', label: 'Project Name', field: 'project_name' },
      {
        name: 'permitYear',
        label: 'Year',
        field: 'permit_year',
        sortable: true
      },
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
        sortable: true,
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

  get editButtonText() {
    if (this.poweruser) {
      return 'Edit Permit / View Catch Data';
    } else {
      return 'Submit Catch Data';
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
    const token = authService.getCurrentUser()!.jwtToken!;
    this.authConfig = { headers: { Authorization: `Bearer ${token}` } };
    axios
      .get('rcat/api/v1/permitsview', this.authConfig)
      .then(response => (this.data = response.data));
    console.log(this.poweruser);
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