<template>
  <div>
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
          <q-item to="/login">
            <q-item-section avatar>
              <q-icon name="meeting_room" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Login</q-item-label>
            </q-item-section>
          </q-item>
          <q-item to="/" exact v-if="isAuthorized(['research-catch-staff','research-catch-user'])">
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Home / FAQs</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            to="/permits"
            exact
            v-if="isAuthorized(['research-catch-staff','research-catch-user'])"
          >
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
        <br />
        <div class="q-gutter-md row no-wrap justify-center">
          <q-select
            outlined
            v-model="yearModel"
            :options="yearList"
            label="Year"
            stack-label
            dense
            @input="yearChosenCheck"
          />
          <q-btn color="primary" label="Add New Year" :loading="loading" @click="addNewYear" />
        </div>
        <br />
        <br />
        <div class="q-gutter-md row no-wrap justify-center">
          <q-table
            class="my-sticky-header-table"
            :data="groupingData"
            :columns="columnsA"
            title="Grouping"
            :row-key="row => row.grouping_id + row.grouping_name"
            virtual-scroll
            :pagination.sync="pagination"
            :rows-per-page-options="[0]"
            :filter="filter1"
            selection="single"
            :selected.sync="selectedTab1"
          >
            <template v-slot:top-right>
              <q-btn color="primary" dense label="Add row" @click="addRowTab1" />
              <q-btn
                class="q-ml-sm"
                dense
                color="primary"
                label="Remove row"
                :disable="selectedTab1.length === 0"
                @click="removeDialog1 = true"
              />
              <q-space />
              <q-input
                class="q-pa-sm"
                rounded
                outlined
                dense
                debounce="300"
                color="primary"
                v-model="filter1"
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-checkbox v-model="props.selected" />
                <q-td key="grouping1" :props="props">
                  {{ props.row.grouping_name }}
                  <q-popup-edit
                    @before-show="cloneRow(props.row)"
                    v-model="clonedRow.grouping_name"
                    buttons
                    @save="updatedValue(props.row, clonedRow.grouping_name, 'grouping_name', 'g')"
                  >
                    <q-input v-model="clonedRow.grouping_name" dense autofocus />
                  </q-popup-edit>
                </q-td>
              </q-tr>
            </template>
          </q-table>

          <q-table
            class="my-sticky-header-table-large"
            :data="speciesGroupingList"
            :columns="columnsB"
            title="Grouping - Species Assignment"
            :row-key="row => row.grouping_species_id + row.grouping_name + row.common_name"
            virtual-scroll
            :pagination.sync="pagination"
            :rows-per-page-options="[0]"
            :filter="filter2"
            selection="single"
            :selected.sync="selectedTab2"
          >
            <template v-slot:top-right>
              <q-btn color="primary" dense label="Add row" @click="addRowTab2" />
              <q-btn
                class="q-ml-sm"
                dense
                color="primary"
                label="Remove row"
                :disable="selectedTab2.length === 0"
                @click="removeDialog2 = true"
              />
              <q-input
                class="q-ml-sm"
                rounded
                outlined
                dense
                debounce="300"
                color="primary"
                v-model="filter2"
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-checkbox v-model="props.selected" />
                <q-td key="grouping2" :props="props">
                  {{ props.row.grouping_name }}
                  <q-popup-edit
                    @before-show="cloneRow(props.row)"
                    v-model="clonedRow.grouping_name"
                    buttons
                    @save="updatedValue(props.row, clonedRow.grouping_name, 'grouping_name', 'gs')"
                  >
                    <q-select
                      v-model="clonedRow.grouping_name"
                      dense
                      :options="groupingList"
                      options-sanitize
                      @add="test()"
                    />
                  </q-popup-edit>
                </q-td>

                <q-td key="species" :props="props">
                  {{ props.row.common_name }}
                  <q-popup-edit
                    @before-show="cloneRow(props.row)"
                    v-model="clonedRow.common_name"
                    buttons
                    @save="updatedValue(props.row, clonedRow.common_name, 'common_name', 'gs')"
                  >
                    <q-input v-model="clonedRow.common_name" dense autofocus />
                  </q-popup-edit>
                </q-td>

                <q-td key="southboundary" :props="props">
                  {{ props.row.south_boundary }}
                  <q-popup-edit
                    @before-show="cloneRow(props.row)"
                    v-model="clonedRow.south_boundary"
                    buttons
                    @save="updatedValue(props.row, clonedRow.south_boundary, 'south_boundary', 'gs')"
                  >
                    <q-input v-model="clonedRow.south_boundary" type="number" dense autofocus />
                  </q-popup-edit>
                </q-td>
                <q-td key="northboundary" :props="props">
                  {{ props.row.north_boundary }}
                  <q-popup-edit
                    @before-show="cloneRow(props.row)"
                    v-model="clonedRow.north_boundary"
                    buttons
                    @save="updatedValue(props.row, clonedRow.north_boundary, 'north_boundary', 'gs')"
                  >
                    <q-input v-model="clonedRow.north_boundary" type="number" dense autofocus />
                  </q-popup-edit>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
        <br />
        <div class="q-gutter-md row justify-center">
          <q-btn color="positive" label="Save" :disable="!this.editedBool" @click="saveCheck" />
          <a href="https://www.fisheries.noaa.gov/privacy-policy" target="_blank">Privacy Policy</a>
        </div>

        <br />
        <q-separator color="primary" />
        <br />

        <div class="q-guter-md">
          <div>Lock Next Year:</div>
          <q-btn :label="newLockYear" color="primary" @click="lockYearDialog = true" />
        </div>
        <br />
        <br />

        <q-dialog v-model="removeDialog1" persistent>
          <q-card>
            <q-card-section class="row items-center">
              <q-icon name="delete_forever" color="primary" size="56px" />
              <span
                class="q-ml-sm"
              >Do you really want to remove this grouping? All associated species listings will also be deleted. Deletions are immediately applied to the database.</span>
            </q-card-section>

            <q-card-actions align="center">
              <q-btn flat label="Confirm" color="primary" @click="deleteRow1" v-close-popup />
              <q-btn flat label="Cancel" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="removeDialog2" persistent>
          <q-card>
            <q-card-section class="row items-center">
              <q-icon name="delete_forever" color="primary" size="56px" left />
              <span
                class="q-ml-sm"
              >Do you really want to remove this row? Deletions are immediately applied to the database.</span>
            </q-card-section>

            <q-card-actions align="center">
              <q-btn flat label="Confirm" color="primary" @click="deleteRow2" v-close-popup />
              <q-btn flat label="Cancel" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="notSavedDialog" persistent>
          <q-card>
            <q-card-section class="row items-center">
              <q-icon name="warning" color="primary" size="56px" />
              <span class="q-ml-sm">
                Changes to current groupings have not been saved,
                switch to new year anyway?
              </span>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Yes" color="primary" @click="yearChanged" v-close-popup />
              <q-btn flat label="No" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="leavePageDialog" persistent>
          <q-card>
            <q-card-section class="row items-center">
              <q-icon name="warning" color="primary" size="56px" />
              <span class="q-ml-sm">
                Changes to current groupings have not been saved, do
                you really want to leave this page?
              </span>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Yes" color="primary" @click="leavePage" v-close-popup />
              <q-btn flat label="No" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="saveDialog" persistent>
          <q-card>
            <q-card-section class="row items-center">
              <q-icon name="warning" color="primary" size="56px" />
              <span class="q-ml-sm">
                Changes made to grouping species rows that are currently
                being used by catch data, continue with save?
              </span>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Yes" color="primary" @click="saveChanges" v-close-popup />
              <q-btn flat label="No" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="lockYearDialog" persistent>
          <q-card>
            <q-card-section class="row items-center">
              <q-icon name="warning" color="primary" size="56px" />
              <span class="q-ml-sm">Are you sure you want to lock submissions for {{ newLockYear }}?</span>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Yes" color="primary" @click="addLockYear" v-close-popup />
              <q-btn flat label="No" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-page-container>
    </q-layout>

    <div>{{ newLockYear }}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
//import { State, Action, Getter } from 'vuex-class';
import Component from 'vue-class-component';
import axios from 'axios';
import { authService } from '@boatnet/bn-auth/lib';

interface GroupingSpeciesRow {
  grouping_species_id?: number | string | null;
  grouping_name?: string | null;
  common_name?: string | null;
  year?: number;
  south_boundary?: number | undefined;
  north_boundary?: number | undefined;
}

interface GroupingRow {
  grouping_id: number | string | null;
  grouping_name: string | null;
}

@Component
export default class GroupingManagement extends Vue {
  data = [];
  groupingData: GroupingRow[] = [];
  groupingList: (string | null)[] = [];
  speciesGroupingList: GroupingSpeciesRow[] = [];
  groupingUpdates: object = {};
  speciesGroupingUpdates: object = {};
  yearModel = 2019;
  currentYear = 2019;
  yearList: number[] = [];
  newLockYear: number = 9999;
  catchUsing: number[] = [];
  authConfig: object = {};
  selectedTab1: GroupingRow[] = [];
  selectedTab2: GroupingSpeciesRow[] = [];
  loading: boolean = false;
  editedBool: boolean = false;
  notSavedDialog: boolean = false;
  saveDialog: boolean = false;
  removeDialog1: boolean = false;
  removeDialog2: boolean = false;
  lockYearDialog: boolean = false;

  storeToRoute = { path: '' };
  leavePageDialog: boolean = false;

  temp: object[] = [];

  pagination = {
    rowsPerPage: 0
  };
  filter1 = '';
  filter2 = '';

  clonedRow = {};

  columnsA = [
    {
      name: 'grouping1',
      label: 'Grouping',
      field: 'grouping_name',
      sortable: true
    }
  ];

  columnsB = [
    {
      name: 'grouping2',
      label: 'Grouping',
      field: 'grouping_name',
      sortable: true
    },
    {
      name: 'species',
      label: 'Species',
      field: 'common_name',
      sortable: true
    },
    {
      name: 'southboundary',
      label: 'South Boundary',
      field: 'south_boundary',
      sortable: true
    },
    {
      name: 'northboundary',
      label: 'North Boundary',
      field: 'north_boundary',
      sortable: true
    }
  ];

  yearChosenCheck() {
    if (!this.editedBool) {
      this.yearChanged();
    } else {
      this.notSavedDialog = true;
    }
  }

  // switch active year
  async yearChanged() {
    try {
      this.currentYear = this.yearModel;
      this.speciesGroupingUpdates = {};
      this.groupingUpdates = {};
      await axios
        .get('rcat/api/v1/grouping/' + this.currentYear, this.authConfig)
        .then(response => (this.groupingData = response.data))
        .catch(error => {
          console.log(error.response);
        });
      await axios
        .get('rcat/api/v1/speciesgrouping/' + this.currentYear, this.authConfig)
        .then(response => (this.speciesGroupingList = response.data))
        .catch(error => {
          console.log(error.response);
        });
      console.log('Table data refreshed from database');
      this.editedBool = false;
    } catch (error) {
      console.log('error', error);
      this.$q.notify({
        message: `Failed to retrieve grouping information, try refreshing page,
           Error: ${error.response.data.message}`,
        color: 'red'
      });
    }
  }

  // create new year for new next missing, copy prior years entries as starting point
  async addNewYear() {
    // turn on spinny wheel
    this.loading = true;
    let newYear = Math.max(...this.yearList) + 1;

    try {
      await axios.post(
        'rcat/api/v1/groupmanage',
        { year: newYear },
        this.authConfig
      );
      this.$q.notify({
        message: 'Groupings added!',
        color: 'green'
      });
      this.yearList.push(newYear);
      this.yearModel = newYear;
      this.yearChanged();
    } catch (error) {
      console.log('error', error);
      this.$q.notify({
        message: `Failed to add new groupings for year ${newYear}. Error: 
                  ${error.response.data.message}`,
        color: 'red'
      });
    } finally {
      // turn off spinyy wheel
      this.loading = false;
    }
  }

  // Add year to locked catch submission table
  async addLockYear() {
    try {
      await axios.put(
        'rcat/api/v1/lockyear',
        { year: this.newLockYear },
        this.authConfig
      );
      this.$q.notify({
        message: `${this.newLockYear} locked.`,
        color: 'green'
      });
      this.newLockYear += 1;
    } catch (error) {
      console.log('error', error);
      this.$q.notify({
        message: `Failed to add ${this.newLockYear} to lock table. Error: 
                  ${error.response.data.message}`,
        color: 'red'
      });
    }
  }

  updatedValue(originalRow, newValue, key, type) {
    console.log(originalRow);
    console.log(newValue);
    var initialValue = originalRow[key];
    originalRow[key] = newValue;
    console.log(originalRow);

    if (type === 'g') {
      console.log('updating grouping list');
      this.groupingList = this.groupingData.map(a => a.grouping_name).sort();
      console.log(this.groupingList);
      if (!(originalRow.grouping_id in this.groupingUpdates)) {
        this.groupingUpdates[originalRow.grouping_id] = originalRow;
      }
      this.speciesGroupingList.forEach(obj => {
        if (obj.grouping_name && obj.grouping_name === initialValue) {
          obj.grouping_name = newValue;
          if (obj.grouping_species_id) {
            this.speciesGroupingUpdates[obj.grouping_species_id] = obj;
          }
        }
      });
    } else if (type === 'gs') {
      // if row is not new and not already recorded
      if (
        originalRow.grouping_species_id !== 'new' &&
        !(originalRow.grouping_species_id in this.speciesGroupingUpdates)
      ) {
        this.speciesGroupingUpdates[
          originalRow.grouping_species_id
        ] = originalRow;
      }
    }
    if (newValue !== initialValue) {
      this.editedBool = true;
    }
  }

  saveCheck() {
    // Get list grouping species ids used by catch data
    // that overlap with changed rows
    let overlap = Object.keys(this.speciesGroupingUpdates).filter(
      value => -1 !== this.catchUsing.indexOf(Number(value))
    );
    if (overlap.length > 0) {
      this.saveDialog = true;
    } else {
      this.saveChanges();
    }
  }

  async saveChanges() {
    // Updated and new rows in Grouping Table
    if (Object.keys(this.groupingUpdates).length > 0) {
      let updateGData: GroupingRow[] = [];
      for (let [key, value] of Object.entries(this.groupingUpdates)) {
        updateGData.push({
          grouping_id: key,
          grouping_name: value.grouping_name
        });
      }
      this.temp = updateGData;
      let uploadObject2 = { update_data: updateGData };
      try {
        // api call to database
        await axios.put('rcat/api/v1/grouping', uploadObject2, this.authConfig);
        this.$q.notify({
          message: 'Grouping changes saved to database',
          color: 'green'
        });

        // reset change trackers
        this.groupingUpdates = {};
      } catch (error) {
        console.log('error', error);
        let dataStr = updateGData.map(a => `${a.grouping_name}`);
        this.$q.notify({
          message: `Failed to save any table changes. Error during update 
                    for grouping rows ${dataStr}. Error: 
                    ${error.response.data.message}`,
          color: 'red'
        });
        // If initial grouping table upates fails, exit out of save process
        return;
      }
    }

    // Updated rows in Grouping Species Table
    if (Object.keys(this.speciesGroupingUpdates).length > 0) {
      let updateGSData: GroupingSpeciesRow[] = [];
      for (let [key, value] of Object.entries(this.speciesGroupingUpdates)) {
        let addObj = { grouping_species_id: key };
        for (let [keyi, valuei] of Object.entries(value)) {
          if (valuei) {
            addObj[keyi] = valuei;
          }
        }
        updateGSData.push(addObj);
      }
      let uploadObject1 = { update_data: updateGSData };
      try {
        await axios.put(
          'rcat/api/v1/speciesgrouping',
          uploadObject1,
          this.authConfig
        );
        this.$q.notify({
          message: 'Grouping Species Changes saved to database',
          color: 'green'
        });

        // reset change trackers
        this.speciesGroupingUpdates = {};
      } catch (error) {
        console.log('error', error);
        let dataStr = updateGSData.map(
          a => `${a.grouping_name}, ${a.common_name}`
        );
        this.$q.notify({
          message: `Unknown error, failed to save grouping species changes ${dataStr}
                    Error: ${error.response.data.message}`,
          color: 'red'
        });
        // If update fails, don't reload table or continue with save
        return;
      }
    }

    // New grouping species entries
    let newGroupingSpeciesRows: GroupingSpeciesRow[] = [];
    for (let row of this.speciesGroupingList) {
      if (
        row.grouping_species_id === 'new' &&
        row.grouping_name &&
        row.common_name
      ) {
        console.log(row);
        newGroupingSpeciesRows.push({
          grouping_name: row.grouping_name,
          common_name: row.common_name,
          year: this.currentYear,
          south_boundary: row.south_boundary,
          north_boundary: row.north_boundary
        });
      }
    }

    if (newGroupingSpeciesRows.length > 0) {
      let uploadObject3 = { update_data: newGroupingSpeciesRows };
      try {
        await axios.post(
          'rcat/api/v1/speciesgrouping/',
          uploadObject3,
          this.authConfig
        );
        this.$q.notify({
          message: 'New Grouping Species rows saved to database',
          color: 'green'
        });
      } catch (error) {
        console.log('error', error);
        let dataStr = newGroupingSpeciesRows.map(
          a => `${a.grouping_name}, ${a.common_name}`
        );
        this.$q.notify({
          message: `Failed to save new grouping species rows 
          ${dataStr}. Error: ${error.response.data.message}`,
          color: 'red'
        });
        // If update fails, don't reload tables
        return;
      }
    }

    // reset edited bool
    this.editedBool = false;

    // repull table data
    try {
      await axios
        .get('rcat/api/v1/grouping/' + this.currentYear, this.authConfig)
        .then(response => (this.groupingData = response.data));
      console.log('Grouping table data refreshed from database');
      await axios
        .get('rcat/api/v1/speciesgrouping/' + this.currentYear, this.authConfig)
        .then(response => (this.speciesGroupingList = response.data));
      console.log('Grouping Species table data refreshed from database');
    } catch (error) {
      console.log(error.response.data.message);
      this.$q.notify({
        message: `grouping and species data updated but error when re-fetching 
           grouping species data, please try refreshing the page. Error: 
           ${error.response.data.message}`,
        color: 'red'
      });
    }
  }

  async addRowTab1() {
    this.groupingData.push({
      grouping_id: null,
      grouping_name: null
    });
  }

  async deleteRow1() {
    if (this.selectedTab1[0].grouping_id) {
      try {
        await axios.delete(
          `rcat/api/v1/grouping/${this.selectedTab1[0].grouping_id}/${this.currentYear}`,
          this.authConfig
        );
        this.selectedTab1 = [];
        console.log('ROW DELTEDED');
      } catch (error) {
        console.log(error.response.data.message);
        this.$q.notify({
          message: `Failed to delete grouping set. Error: 
                    ${error.response.data.message}`,
          color: 'red'
        });
      }

      // repull grouping table data
      try {
        await axios
          .get('rcat/api/v1/grouping/' + this.currentYear, this.authConfig)
          .then(response => (this.groupingData = response.data));
        await axios
          .get(
            'rcat/api/v1/speciesgrouping/' + this.currentYear,
            this.authConfig
          )
          .then(response => (this.speciesGroupingList = response.data));
        console.log('Table data refreshed from database');
      } catch (error) {
        console.log(error.response.data.message);
        this.$q.notify({
          message: `grouping set deleted but error when re-fetching grouping data, 
            please try refreshing the page. Error: ${error.response.data.message}`,
          color: 'red'
        });
      }
    } else {
      this.selectedTab1[0].grouping_id = 'delete';
      var index2 = this.groupingData.findIndex(x => x.grouping_id === 'delete');
      this.groupingData.splice(index2, 1);
      this.selectedTab1 = [];
    }
  }

  async addRowTab2() {
    this.speciesGroupingList.push({
      grouping_species_id: 'new',
      grouping_name: null,
      common_name: null,
      south_boundary: undefined,
      north_boundary: undefined
    });
  }

  async deleteRow2() {
    if (this.selectedTab2[0].grouping_species_id !== 'new') {
      try {
        // Delete the row with specified grouping_species_id
        await axios.delete(
          'rcat/api/v1/groupmanage/' + this.selectedTab2[0].grouping_species_id,
          this.authConfig
        );
        console.log('ROW DELTEDED');
        var index = this.speciesGroupingList.findIndex(
          x => x.grouping_species_id == this.selectedTab2[0].grouping_species_id
        );
        this.speciesGroupingList.splice(index, 1);
        this.selectedTab2 = [];
      } catch (error) {
        console.log(error.response.data.message);
        if (error.response.status == 403) {
          this.$q.notify({
            message:
              'Cannot delete grouping species, data being used for catch data entries.',
            color: 'red'
          });
        } else {
          this.$q.notify({
            message: `Failed to delete grouping species. Error: ${error.response.data.message}`,
            color: 'red'
          });
        }
      }
    } else {
      this.selectedTab2[0].grouping_species_id = 'delete';
      var index2 = this.speciesGroupingList.findIndex(
        x => x.grouping_species_id === 'delete'
      );
      this.speciesGroupingList.splice(index2, 1);
      this.selectedTab2 = [];
    }
  }

  leftDrawerOpen = false;

  test() {
    console.log('I added.....');
  }

  cloneRow(row) {
    this.clonedRow = { ...row };
  }

  customSort (rows, sortBy, descending) {
    const rdata = [ ...rows ]
    if (sortBy) {
      rdata.sort((a, b) => {
        const x = descending ? b : a
        const y = descending ? a : b
        if ( sortBy === 'common_name') {
          // string sort
          return x[sortBy] > y[sortBy] ? 1 : x[sortBy] < y[sortBy] ? -1 : 0
        }
        else {
          // numeric sort
          return parseFloat(x[sortBy]) - parseFloat(y[sortBy])
        }
      })
    }
    return rdata
  }

  private isAuthorized(authorizedRoles: string[]) {
    for (const role of authorizedRoles) {
      if (authService.getCurrentUser()!.roles.includes(role)) {
        return true;
      }
    }
    return false;
  }

  // beforeRouteLeave (to, from, next) {
  //   console.log('at least im triggering')
  //   const answer = window.confirm('Do you really want to leave? you have unsaved changes!');
  //   if (answer) {
  //     next();
  //   } else {
  //     next(false);
  //   }
  // }

  leavePage() {
    this.editedBool = false;
    this.$router.push(this.storeToRoute.path);
  }

  beforeRouteLeave(to, from, next) {
    if (!this.editedBool) {
      next();
    } else {
      next(false);
      this.leavePageDialog = true;
      this.storeToRoute = to;
    }
  }

  mounted() {
    const token = authService.getCurrentUser()!.jwtToken!;
    this.authConfig = { headers: { Authorization: `Bearer ${token}` } };
    // temp, update this to pull current year
    this.currentYear = 2019;
    this.yearModel = this.currentYear;
    axios
      .get('rcat/api/v1/grouping/' + this.currentYear, this.authConfig)
      .then(response => (this.groupingData = response.data))
      .catch(error => {
        console.log(error.response);
      });
    axios
      .get('rcat/api/v1/speciesgrouping/' + this.currentYear, this.authConfig)
      .then(response => (this.speciesGroupingList = response.data))
      .catch(error => {
        console.log(error.response);
      });
    axios
      .get('rcat/api/v1/groupmanage', this.authConfig)
      .then(response => (this.yearList = response.data.map(a => a.year)))
      .catch(error => {
        console.log(error.response);
      });
    axios
      .get('/rcat/api/v1/catchgs', this.authConfig)
      .then(response => (this.catchUsing = response.data.grouping_species_ids))
      .catch(error => {
        console.log(error.response);
      });
    axios
      .get('/rcat/api/v1/lockyear', this.authConfig)
      .then(response => (this.newLockYear = response.data[0].max + 1))
      .catch(error => {
        console.log(error.response);
      });
  }
}
</script>

<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  height: 600px
  width: 360px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #FFFFFF
  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0
  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px

.my-sticky-header-table-large
  /* height or max-height is important */
  height: 600px 
  width: 800px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #FFFFFF
  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0
  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style>