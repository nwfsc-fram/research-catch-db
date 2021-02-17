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
              <div>Catch Data Submitted?</div>
              <q-field outlined square class="bg-indigo-1">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{(pointOfContact && pointOfContact.length > 0) ? 'Yes' : 'No' }}</div>
                </template>
              </q-field>
            </div>
          </q-tab-panel>

          <q-tab-panel name="catchData" :disable="catchLockedBool">
            <div>
              You only need to complete one of the below options. Once you've uploaded a
              spreadsheet, your data will be populated in the table below. You can also
              enter data directly into the table. Once you've checked the data for errors
              you can submit using the button at the bottom of the page. Submitted data will 
              overwrite any previously submitted data. You can download the Microsoft Excel 
              sheet and CSV versions of the groupings for each year 
              <a href="https://nwcdevfram.nwfsc.noaa.gov/research-catch/">here</a>.
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

          <q-tab-panel name="catchData" :disable="catchLockedBool">
            <div class="row hidden justify-start q-gutter-sm">
              <div class="col-3">Data URL</div>
              <q-input class="col-6" outlined v-model="dataURL" />
              <q-btn class="col-2" color="primary" label="Retrieve Data" />
            </div>

            <p>To reupload a file, please clear and reselect the file name.</p>
            <div class="row justify-start q-gutter-sm">
              <div class="col-3">Microsoft Excel File Upload</div>
              <q-file
                @input="startIngest($event)"
                class="col-6"
                clearable
                outlined
                v-model="excelFile"
              />
              <a 
                style="text-decoration:none"
                href="researchCatchTemplate2020.xlsm"
                download="researchCatchTemplate2020">
                  <q-btn
                    class="col-2"
                    color="primary"
                    label="Download Template"
                  />
              </a>
            </div>
            <br />
            <q-separator color="primary" />
          </q-tab-panel>
        </q-tab-panels>

        <q-tab-panels v-model="tab" animated>
          <br />
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

          <q-tab-panel name="catchData" :disable="catchLockedBool">
            <br />

            <div class="row q-gutter-sm no-wrap">
              <b>Table Entry</b>
              <br />
            </div>

            <q-banner class="bg-green-11 text-body1 justify-around">
              For small unmeasured amounts of catch, please use 0.001mt for Total Catch. Depth Bins 
              and percent released fields only apply to a small subset of species (Cowcod Rockfish, 
              Canary Rockfish, and Yelloweye Rockfish). The depth bin field defines a preset 
              range of depth values. If catch for a qualifying species was released at multiple 
              depth ranges please use one row per depth bin range.
              <br />
              <br />If a species caught under your permit is missing from the species list,
              please contact Kate Richerson (kate.e.richerson@noaa.gov) or
              Kayleigh Somers (kayleigh.somers@noaa.gov)
            </q-banner>

            <br />

            <q-table
              :data="data"
              :columns="columns"
              :loading="tableLoading"
              :row-key="row => row.grouping.concat(':', row.species)"
              no-data-label="Spreadsheet Import Failed"
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td
                    key="grouping"
                    :props="props"
                    :style="groupingSpeciesList.includes(props.row.grouping.concat(props.row.species)) ? '' : `color:red; font-weight:bold;`"
                  >
                    {{ props.row.grouping }}
                    <q-popup-edit v-model="props.row.grouping" buttons>
                      <q-select
                        v-model="props.row.grouping"
                        :options="groupingSelect(props.row.species)"
                      />
                    </q-popup-edit>
                  </q-td>
                  <q-td
                    key="species"
                    :props="props"
                    :style="groupingSpeciesList.includes(props.row.grouping.concat(props.row.species)) ? '' : `color:red; font-weight:bold;`"
                  >
                    {{ props.row.species }}
                    <q-popup-edit v-model="props.row.species" buttons>
                      <q-select v-model="props.row.species" dense autofocus :options="speciesList" />
                    </q-popup-edit>
                  </q-td>
                  <q-td key="totalCatch" :props="props">
                    {{ props.row.totalCatch }}
                    <q-popup-edit v-model="props.row.totalCatch" buttons>
                      <q-input type="number" v-model="props.row.totalCatch" dense autofocus />
                    </q-popup-edit>
                  </q-td>
                  <q-td
                    key="depthCaptured"
                    :props="props"
                    :style="(depthBinList.includes(props.row.depthCaptured)) && (props.row.depthCaptured === 'NA' || depthGroupings.includes(props.row.grouping.concat(props.row.species))) ? '' : `color:red;`"
                    >
                    {{ props.row.depthCaptured }}
                    <q-popup-edit v-model="props.row.depthCaptured" buttons>
                      <q-select
                        v-model="props.row.depthCaptured"
                        dense
                        autofocus
                        :options="depthBinList"
                      />
                    </q-popup-edit>
                  </q-td>
                  <q-td auto-width key="released" :props="props">
                    {{ props.row.released }}
                    <q-popup-edit v-model="props.row.released" buttons>
                      <q-input type="number" v-model="props.row.released" dense autofocus />
                    </q-popup-edit>
                  </q-td>
                  <q-td auto-width key="notes" :props="props">
                    <div class="my-table-details">{{ props.row.notes }}</div>
                    <q-popup-edit v-model="props.row.notes" buttons>
                      <q-input type="textarea" v-model="props.row.notes" />
                    </q-popup-edit>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
            <br />
            <div class="row justify-center q-gutter-md">
              <q-btn color="primary" v-if="addRowButton" label="Add Row" @click="addRow" />
              <q-btn
                color="primary"
                label="Submit Catch Data"
                @click="submitCatch"
                :disable="data.length < 1"
              />
              <a href="https://www.fisheries.noaa.gov/privacy-policy" target="_blank">Privacy Policy</a>
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
            <div class="row justify-center q-gutter-md">
              <q-btn color="primary" class="justify-center" @click="updatePermitInfo">Save</q-btn>
              <a href="https://www.fisheries.noaa.gov/privacy-policy" target="_blank">Privacy Policy</a>
            </div>
          </q-tab-panel>

          <q-tab-panel name="catchData" :disable="!catchLockedBool">
            <div>
              Catch Submissions for {{ permit['permit_year'] }} have been closed. Please 
              contact Kate Richerson (kate.e.richerson@noaa.gov) and Kayleigh Somers 
              (kayleigh.somers@noaa.gov) with questions.
            </div>
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
        <div>Save unsuccessful: {{ errorMessage }}</div>
      </q-card-section>
    </q-card>

    <q-dialog v-model="submissionConfirmation">
      <q-card>
        <q-card-section>
          <div class="text-h6">Catch Data Submitted!</div>
        </q-card-section>

        <q-card-section
          class="q-pt-none"
        >Catch data submitted for this permit will overwrite any pre-existing data. 
        Additionally, the app will not display previously submitted data, so users 
        may want to save any data corrections in their original excel spreadsheet.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <br />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { date } from 'quasar';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { authService } from '@boatnet/bn-auth/lib';

interface TableRow {
  grouping: string | undefined;
  species: string | undefined;
  totalCatch: number | undefined;
  depthCaptured: string | undefined;
  released: number | undefined;
  notes: string;
}

@Component
export default class PermitDetailsUser extends Vue {
  dataURL = null;
  excelFile = null;
  tableLoading = false;
  dense = false;
  addRowButton = true;
  catchData = [];
  tab = 'permitDetails';
  saveSuccesfulBlock = false;
  saveFailedBlock = false;
  errorMessage = '';
  submissionConfirmation = false;
  groupingList = null;
  speciesList = [];
  depthGroupings:string[] = [];
  groupingSpeciesList: string[] = [];
  groupingBySpecies = {};
  tempInsert = null;
  depthBinList = ['NA', '0-10', '10-20', '20-30', '30-50', '50-100', '>100'];
  authConfig: object = {};

  catchLockedBool = true;

  data: TableRow[] = [
    {
      grouping: '',
      species: '',
      totalCatch: undefined,
      depthCaptured: undefined,
      released: undefined,
      notes: ''
    }
  ];
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
      label: 'Depth Captured Bin (fm)',
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
    // Take out the point of contact field, assigned when
    // first data submission happens, and vuex store
    // object probably needs to be refactored
    let uploadObject = Object.assign(this.$store.state.sPermit.permit);
    delete uploadObject['point_of_contact'];
    delete uploadObject['delivery_date'];

    axios
      .put('rcat/api/v1/permits', uploadObject, this.authConfig)
      .then(res => {
        console.log(res);
        this.saveSuccesfulBlock = true;
        this.saveFailedBlock = false;
      })
      .catch(error => {
        console.log(error.response.data.message);
        this.errorMessage = 'could not update permit information in database';
        this.saveFailedBlock = true;
        this.saveSuccesfulBlock = false;
      });
  }

  // Next few functions are used to read in excel files
  async ingestExcel(event, callback) {
    if (this.excelFile) {
      let f = this.excelFile;
      let reader = new FileReader();
      reader.onload = callback;
      reader.readAsArrayBuffer(f!);
    }
  }

  async startIngest(e) {
    this.tableLoading = true;
    this.data = [];
    await this.ingestExcel(e, this.handleLoading);
    this.tableLoading = false;
  }

  // Formatting of excel must have the same column order,
  // Also picky about which row it starts at, will cutout
  // blank rows.
  handleLoading(e) {
    let data = new Uint8Array(e.target.result);
    var workbook = XLSX.read(data, { type: 'array' });
    let worksheet = workbook.Sheets[workbook.SheetNames[1]];
    this.catchData = XLSX.utils.sheet_to_json(worksheet, {
      header: [
        'trash',
        'grouping',
        'species',
        'sciname',
        'totalCatch',
        'depthCaptured',
        'released',
        'sb',
        'nb',
        'notes'
      ]
    });
    // slice value of 2 needed for 2019 catch data testing
    // value of 3 for 2020 and beyond
    this.data = this.catchData.slice(3);
  }

  // This fucntionality may need to be refactored
  addRow() {
    let check = false;
    for (let row of this.data) {
      if (row.hasOwnProperty('grouping') && row.hasOwnProperty('species')) {
        check = true;
        break;
      }
    }
    if (!check) {
      console.log('no good data, so cleaning up');
      this.data = [];
    }

    let newRow: TableRow = {
      grouping: '',
      species: '',
      totalCatch: undefined,
      depthCaptured: undefined,
      released: undefined,
      notes: ''
    };
    this.data.push(newRow);
  }

  submitCatch() {
    // first delete any previously submitted data
    axios
      .delete(
        'rcat/api/v1/catch/' + this.permit.research_project_id,
        this.authConfig
      )
      .then(response => console.log(response.data.message))
      .catch(error => {
        console.log(error.response.data.message);
      });

    const checkResult = this.checkCatch();
    console.log(checkResult);
    if (checkResult !== 'passed') {
      this.$q.notify({
        message:
          `Failed to save catch data, see bottom of the 
          page for details`,
        color: 'red'
      });
      this.errorMessage =
        'could not save catch data to database. ' + checkResult;
      this.saveFailedBlock = true;
      this.saveSuccesfulBlock = false;
      return;
    }

    // Now do new data upload
    if (this.data && this.data.length > 0) {
      let axiosData = {
        research_project_id: this.permit['research_project_id'], // eslint-disable-line
        point_of_contact: authService.getCurrentUser()!.username,
        year: this.permit['permit_year'],
        catch_data: this.data // eslint-disable-line
      };

      axios
        .post('rcat/api/v1/catch', axiosData, this.authConfig)
        .then(res => {
          console.log(res);
          this.saveSuccesfulBlock = true;
          this.saveFailedBlock = false;
          this.submissionConfirmation = true;
        })
        // TODO: Catch a 401 response here?
        .catch(error => {
          console.log(error.response.data.message);
          this.errorMessage = 'could not save catch data to database';
          this.saveFailedBlock = true;
          this.saveSuccesfulBlock = false;
        });
    } else {
      // Add message that data table is empty
      this.saveFailedBlock = true;
    }
  }

  // Run a series of checks on catch data before submitting
  // to database
  checkCatch() {
    let checkSet = new Set();
    let zeroStripped: TableRow[] = [];
    for (const row of this.data!) {
      // check for repeated groupings
      if (
        checkSet.has(row.grouping!.concat(row.species!, row.depthCaptured!))
      ) {
        return '\nRepeated grouping/species/depth bin: '.concat(
          row.grouping!,
          ', ',
          row.species!,
          ', ',
          String(row.depthCaptured!)
        );
      } else {
        checkSet.add(row.grouping!.concat(row.species!, row.depthCaptured!));
      }

      if (row.totalCatch && row.totalCatch > 0) {
        zeroStripped.push(row);
      }

      // check for incorrect species grouping combination
      if (
        !this.groupingSpeciesList.includes(row.grouping!.concat(row.species!))
      ) {
        return 'Incorrect grouping and species combination found: '.concat(
          row.grouping!,
          ', ',
          row.species!
        );
      }

      // if depth captured present, make sure it's an applicable species grouping
      // if this is dependent on year will have to make some changes to this
      if (
        row.depthCaptured &&
        row.depthCaptured !== 'NA' &&
        !this.depthGroupings.includes(row.grouping!.concat(row.species!))
      ) {
        return 'Depth Bin defined for grouping and species that is not included in mortality credits: '.concat(
          row.grouping!,
          ', ',
          row.species!
        );
      }

      // if depth capture present, make sure it's an accepted value
      if (row.depthCaptured && !this.depthBinList.includes(row.depthCaptured)) {
        return 'Depth Bin for '.concat(
          row.grouping!,
          ', ',
          row.species!,
          ' is not an accepted value, please edit entry.'
        );
      }

      // if depth bin or precent released defined, make sure the other exists
      if (
        (row.depthCaptured && !row.depthCaptured.includes('NA') && !row.released) ||
        (row.released &&
          Number(row.released) > 0 &&
          (!row.depthCaptured || row.depthCaptured.includes('NA')))
      ) {
        return 'Both depth captured and percent released at depth must be defined for '.concat(
          row.grouping!,
          ', ',
          row.species!
        );
      }
    }

    this.data = zeroStripped;
    return 'passed';
  }

  groupingSelect(species) {
    if (species && species.length > 0) {
      return this.groupingBySpecies[species];
    } else {
      return this.groupingList;
    }
  }

  // Vuex store getters and setters
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

  get pointOfContact() {
    return this.$store.state.sPermit.permit.point_of_contact;
  }

  set pointOfContact(value) {
    this.$store.commit('sPermit/updatePOC', value);
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
    const token = authService.getCurrentUser()!.jwtToken!;
    this.authConfig = { headers: { Authorization: `Bearer ${token}` } };
    axios
      .get('rcat/api/v1/grouping/' + this.permit['permit_year'], this.authConfig)
      .then(
        response =>
          (this.groupingList = response.data.map(a => a.grouping_name))
      )
      .catch(error => {
        console.log(error.response.data.message);
      });
    axios
      .get('rcat/api/v1/species/' + this.permit['permit_year'], this.authConfig)
      .then(
        response =>
          (this.speciesList = response.data.map(a => a.common_name).sort())
      )
      .catch(error => {
        console.log(error.response.data.message);
      });
    axios
      .get('rcat/api/v1/depthgroupings', this.authConfig)
      .then(
        response =>
          (this.depthGroupings = response.data.map(
            a => a.grouping_name + a.common_name
          ))
      )
      .catch(error => {
        console.log(error.response.data.message);
      });
    axios
      .get('rcat/api/v1/speciesgrouping/' + this.permit['permit_year'], this.authConfig)
      .then(response => {
        this.groupingSpeciesList = response.data.map(a =>
          a.grouping_name.concat(a.common_name)
        );
        for (let row of response.data)
          if (row.common_name in this.groupingBySpecies) {
            this.groupingBySpecies[row.common_name].push(row.grouping_name);
          } else {
            this.groupingBySpecies[row.common_name] = [row.grouping_name];
          }
      })
      .catch(error => {
        console.log(error.response.data.message);
      });
    axios
      .post('/rcat/api/v1/lockyear', {year: this.permit['permit_year']}, this.authConfig)  
      .then(response => (this.catchLockedBool = response.data))
      .catch(error => {
        console.log(error.response);
      });
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