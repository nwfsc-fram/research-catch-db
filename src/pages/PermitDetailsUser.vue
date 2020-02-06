<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="permitDetails" label="Permit Details" />
          <q-tab name="catchData" label="Catch Data" />
        </q-tabs>

        <q-separator />
        <br />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="permitDetails" class="bg-indigo-4" style="max-width: 600px">
            <div>
              <div>Assigning point of contact to data submission:</div>
              <q-field outlined label="Point of Contact" stack-label square class="bg-indigo-1">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{ pointOfContact }}</div>
                </template>
              </q-field>
              <q-field square outlined label="Email Address" stack-label class="bg-indigo-1">
                <template v-slot:control>
                  <div class="full-width no-outline">{{ email }}</div>
                </template>
              </q-field>
            </div>
          </q-tab-panel>

          <q-tab-panel name="catchData">
            <div class="row no-wrap justify-between">
              <div class="text-h6 col-2">Catch Data</div>
              <div class="col-10">
                You only need to complete one of these three options.
                Once you've retrieved data from a URL or uploaded a spreadsheet, your data will be populated in
                the table below. You can also enter data directly into the table. If the data has no errors you can submit your data using the button at the
                bottom of the page.
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>

        <br />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="permitDetails" class="bg-blue-4" style="max-width: 600px">
            <q-field outlined label="Permit Number" stack-label square class="bg-blue-1">
              <template v-slot:control>
                <div class="full-width no-outline">{{ permit['permit_number'] }}</div>
              </template>
            </q-field>

            <q-field outlined label="Permit Year" stack-label square class="bg-blue-1">
              <template v-slot:control>
                <div class="full-width no-outline">{{ permit['permit_year'] }}</div>
              </template>
            </q-field>

            <q-field outlined label="Organization" stack-label class="bg-blue-1">
              <template v-slot:control>
                <div class="full-width no-outline">{{ permit['organization_name'] }}</div>
              </template>
            </q-field>

            <q-field outlined label="Project Name" stack-label class="bg-blue-1">
              <template v-slot:control>
                <div class="full-width no-outline">{{ permit['project_name'] }}</div>
              </template>
            </q-field>

            <q-field outlined label="Principle Investigator" stack-label class="bg-blue-1">
              <template v-slot:control>
                <div class="full-width no-outline">{{ permit['principle_investigator'] }}</div>
              </template>
            </q-field>
          </q-tab-panel>

          <q-tab-panel name="catchData">
            <div class="row justify-start q-gutter-sm">
              <div class="col-3">Data URL</div>
              <q-input class="col-6" outlined v-model="dataURL" />
              <q-btn class="col-2" color="primary" label="Retrieve Data" />
            </div>
            <br />
            <div class="row justify-start q-gutter-sm">
              <div class="col-3">Microsoft Excel File Upload</div>
              <q-file @input="startIngest($event)" class="col-6" outlined v-model="excelFile" />
              <q-btn class="col-2" color="primary" label="Download Template" @click="downloadTemplate"/>
            </div>
            <br />
            <q-separator color="primary" />
          </q-tab-panel>
        </q-tab-panels>

        <br />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="permitDetails" class="bg-cyan-4" style="max-width: 600px">
            <q-field outlined label="Permit Start" stack-label class="bg-cyan-1">
              <template v-slot:control>
                <div class="full-width no-outline">{{ startDate }}</div>
              </template>
            </q-field>

            <q-field outlined label="Permit End" stack-label class="bg-cyan-1">
              <template v-slot:control>
                <div class="full-width no-outline">{{ endDate }}</div>
              </template>
            </q-field>
          </q-tab-panel>

          <q-tab-panel name="catchData">
            <div class="row q-gutter-sm no-wrap">
              <div>Table Entry</div>
              <div class="offset-5">
                Mode:
                <q-btn-toggle
                  v-model="weights"
                  push
                  glossy
                  toggle-color="primary"
                  :options="[
                            {label: 'Weights', value: true},
                            {label: 'Counts + Avg Weight', value: false}
                          ]"
                />
              </div>
            </div>
            <q-table
              :data="data"
              :columns="columns"
              :loading="tableLoading"
              :row-key="row => row.grouping.concat(':', row.species)"
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td
                    key="grouping"
                    :props="props"
                    :style="groupingSpeciesList.includes(props.row.grouping.concat(props.row.species)) ? '' : `color:red;`"
                  >
                    <div class="text-pre-wrap">{{ props.row.grouping }}</div>
                    <q-popup-edit v-model="props.row.grouping">
                      <q-select v-model="props.row.grouping" :options="groupingList" />
                    </q-popup-edit>
                  </q-td>
                  <q-td
                    key="species"
                    :props="props"
                    :style="groupingSpeciesList.includes(props.row.grouping.concat(props.row.species)) ? '' : `color:red;`"
                  >
                    {{ props.row.species }}
                    <q-popup-edit v-model="props.row.species" title="Update Species" buttons>
                      <q-select v-model="props.row.species" dense autofocus :options="speciesList" />
                    </q-popup-edit>
                  </q-td>
                  <q-td key="totalCatch" :props="props">
                    {{ props.row.totalCatch }}
                    <q-popup-edit
                      v-model="props.row.totalCatch"
                      title="Update TotalCatch"
                      buttons
                      persistent
                    >
                      <q-input
                        type="text"
                        v-model="props.row.totalCatch"
                        dense
                        autofocus
                        hint="Use buttons to close"
                      />
                    </q-popup-edit>
                  </q-td>
                  <q-td key="depthCaptured" :props="props">
                    <div class="text-pre-wrap">{{ props.row.depthCaptured }}</div>
                    <q-popup-edit v-model="props.row.depthCaptured">
                      <q-select
                        v-model="props.row.depthCaptured"
                        dense
                        autofocus
                        :options="depthBinList"
                      />
                    </q-popup-edit>
                  </q-td>
                  <q-td auto-width key="released" :props="props">
                    <div class="text-pre-wrap">{{ props.row.released }}</div>
                    <q-popup-edit v-model="props.row.released">
                      <q-input type="text" v-model="props.row.released" dense autofocus />
                    </q-popup-edit>
                  </q-td>
                  <q-td auto-width key="notes" :props="props">
                    <div class="my-table-details">{{ props.row.notes }}</div>
                    <q-popup-edit v-model="props.row.notes">
                      <q-input type="textarea" v-model="props.row.notes" />
                    </q-popup-edit>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
            <br />
            <div class="row">
            <q-btn color="primary" label="Add Row" @click="addRow" />
            <q-btn color="positive" label="Submit Catch Data" @click="submitCatch" :disable="data.length < 1"/>
            </div>
          </q-tab-panel>
        </q-tab-panels>

        <br />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="permitDetails" class="bg-teal-4" style="max-width: 600px">
            <font size="4">User Entry</font>
            <br />
            <div>Notes</div>
            <q-input v-model="permitNotes" filled type="textarea" class="bg-teal-1" />
            <br />
            <q-card class="bg-teal-1 q-pa-md">
              <div class="row">
                <p class="col-5">Mortality Credits Applicable:</p>
                <q-btn-toggle
                  v-model="permitMortality"
                  push
                  toggle-color="primary"
                  class="bg-blue-1"
                  :options="[
          {label: 'Yes', value: true},
          {label: 'No', value: false}
        ]"
                />
              </div>
              <br />
              <p>
                Mortality Credit Rules:
                <br />1. Gear must be Hook & Line
                <br />2. Descending device must be used
                <br />3. Depth of capture must be recorded
                <br />4. Only applies to Canary rockfish, Yelloweye rockfish, & Cowcod
              </p>
            </q-card>
            <br />
            <q-btn color="primary" class="justify-center" @click="updatePermitInfo">Save</q-btn>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
    <br />

    <br />
    <br />
    <q-card class="bg-green" v-if="saveSuccesfulBlock">
      <q-card-section>
        <div>Save was successful</div>
      </q-card-section>
    </q-card>
    <q-card class="bg-red" v-if="saveFailedBlock">
      <q-card-section>
        <div>Save unsucessful</div>
      </q-card-section>
    </q-card>
    <div>{{ tempInsert }}</div>
    <br />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { date, exportFile } from 'quasar';
import axios from 'axios';
import fs from 'fs';
import XLSX from 'xlsx';

interface TableRow {
  grouping: string | undefined;
  species: string | undefined;
  totalCatch: number | undefined;
  depthCapture: number | undefined;
  released: string | undefined;
  notes: string;
}

@Component
export default class Permits extends Vue {
  // to-do: poc and email will need to be hooked up to
  // login acccount
  pointOfContact = 'Seric Ogaz';
  email = 'trogdor@noaa.gov';
  dataURL = null;
  excelFile = null;
  tableLoading = false;
  weights = true;
  dense = false;
  catchData = [];
  tab = 'permitDetails';
  saveSuccesfulBlock = false;
  saveFailedBlock = false;
  groupingList = null;
  speciesList = null;
  groupingSpeciesList = [];
  tempInsert = null;
  depthBinList = [
    'NA',
    '0-10',
    '10-20',
    '20-30',
    '30-50',
    '30-50',
    '50-100',
    '>100'
  ];

  data: TableRow[] = [];
  columns = [
    {
      name: 'grouping',
      label: 'Grouping',
      field: 'grouping',
      sortable: true
    },
    {
      name: 'species',
      align: 'center',
      label: 'Species',
      field: 'species',
      sortable: true
    },
    {
      name: 'totalCatch',
      label: 'Total Catch (mt)',
      field: 'totalCatch',
      sortable: true
    },
    {
      name: 'depthCaptured',
      label: 'Depth Captured Bin',
      field: 'depthCaptured'
    },
    {
      name: 'released',
      label: '% Released at Depth',
      field: 'released'
    },
    {
      name: 'notes',
      label: 'Notes',
      field: 'notes'
    }
  ];

  updatePermitInfo() {
    // Take out the point of contact field
    let uploadObject = Object.assign(this.$store.state.sPermit.permit);
    delete uploadObject['point_of_contact'];
    delete uploadObject['delivery_date'];

    axios
      .put('http://localhost:8080/api/permits', uploadObject)
      .then(res => {
        console.log(res);
        this.saveSuccesfulBlock = true;
        this.saveFailedBlock = false;
      })
      .catch(error => {
        console.log(error);
        this.saveFailedBlock = true;
        this.saveSuccesfulBlock = false;
      });
  }

  ingestExcel(event, callback) {
    if (this.excelFile) {
      let f = this.excelFile;
      let reader = new FileReader();
      reader.onload = callback;
      reader.readAsArrayBuffer(f!);
    }
  }

  startIngest(e) {
    this.tableLoading = true;
    this.ingestExcel(e, this.handleLoading);
    this.tableLoading = false;
  }

  handleLoading(e) {
    let data = new Uint8Array(e.target.result);
    var workbook = XLSX.read(data, { type: 'array' });
    let worksheet = workbook.Sheets[workbook.SheetNames[1]];
    this.catchData = XLSX.utils.sheet_to_json(worksheet, {
      header: [
        'grouping',
        'species',
        'totalCatch',
        'depthCapture',
        'released',
        'notes'
      ]
    });
    this.data = this.catchData.slice(2);
  }

  downloadTemplate() {
    fs.open('../statics/RMDE2019.xlsm', 'r', (err, fd) => {
      if (err) throw err;
      const blob = fd as Blob;
      exportFile('RMDE2019.xlsm', blob);

      fs.close(fd, (err) => {
        if (err) throw err;
      });
    });
  }

  addRow() {
    let newRow = {
      grouping: undefined,
      species: undefined,
      totalCatch: undefined,
      depthCapture: undefined,
      released: undefined,
      notes: ''
    };
    this.data.push(newRow);
  }

  submitCatch() {
    if (this.data.length > 0){
      console.log('at least I got here');
      let axiosData = {'research_project_id': this.permit['research_project_id'],
        'year': this.permit['permit_year'],
        'catch_data': this.data
      }

      axios
        .put('http://localhost:8080/api/catch', axiosData)
        .then(res => {
          console.log(res);
          this.saveSuccesfulBlock = true;
          this.saveFailedBlock = false;
        })
        // TODO: How do I catch a 401 response here?
        .catch(error => {
          console.log(error);
          this.saveFailedBlock = true;
          this.saveSuccesfulBlock = false;
        });
    }
    else {
      // Add message that data table is empty
      this.saveFailedBlock = true;
    }
  }
    
  get startDate() {
    return date.formatDate(this.permit['start_date'], 'YYYY-MM-DD');
  }

  get endDate() {
    return date.formatDate(this.permit['end_date'], 'YYYY-MM-DD');
  }

  get permitNotes() {
    return this.$store.state.sPermit.permit.notes;
  }

  set permitNotes(value) {
    this.$store.commit('sPermit/updateNotes', value);
  }

  get permitMortality() {
    return this.$store.state.sPermit.permit.mortality_credits_applicable;
  }

  set permitMortality(value) {
    this.$store.commit('sPermit/updateMortality', value);
  }

  get permit() {
    return this.$store.state.sPermit.permit;
  }

  set permit(value) {
    this.$store.commit('sPermit/updateSPermit', value);
  }

  mounted() {
    axios
      .get('http://localhost:8080/api/grouping')
      .then(
        response =>
          (this.groupingList = response.data.map(a => a.grouping_name))
      );
    axios
      .get('http://localhost:8080/api/species')
      .then(
        response => (this.speciesList = response.data.map(a => a.common_name))
      );
    axios
      .get('/api/speciesgrouping')
      .then(
        response =>
          (this.groupingSpeciesList = response.data.map(a =>
            a.grouping_name.concat(a.common_name)
          ))
      );
  }
}
</script>

<style>
.my-table-details {
  font-size: 0.85em;
  font-style: italic;
  max-width: 200px;
  white-space: normal;
  color: #555;
  margin-top: 4px;
}
</style>