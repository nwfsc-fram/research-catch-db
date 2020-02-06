<template>
  <div class="q-pa-md">
    <q-form @submit="saveNewPermit" autocomplete="off" id="disable-lastpass-search">
      <div class="q-gutter-y-md" style="max-width: 600px">
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
            <q-tab-panel v-if="saveModel" name="permitDetails" class="bg-indigo-4">
              <div ref="section">
                <div>Login Account Information:</div>
                <q-field
                  square
                  outlined
                  label="Point of Contact"
                  stack-label
                  :dense="dense"
                  readonly
                  class="bg-indigo-1"
                >
                  <template v-slot:control>
                    <div class="full-width no-outline">{{ permit_info.pointOfContact }}</div>
                  </template>
                </q-field>
                <q-field
                  square
                  outlined
                  label="Email Address"
                  stack-label
                  :dense="dense"
                  readonly
                  class="bg-indigo-1"
                >
                  <template v-slot:control>
                    <div class="full-width no-outline">{{ permit_info.email }}</div>
                  </template>
                </q-field>
              </div>
            </q-tab-panel>

            <q-tab-panel name="catchData">
              <div class="text-h6">Alarms</div>Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </q-tab-panel>
          </q-tab-panels>

          <br />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="permitDetails" class="bg-blue-4">
              <q-input
                outlined
                v-model="permitNumber"
                label="Permit Number"
                stack-label
                :dense="dense"
                class="bg-blue-1"
                error-message="Permit number is an invalid format"
                :error="!isPermitNumValid"
                :rules="[val => !!val || 'Field is required']"
                lazy-rules
                :autofocus="false"
              ></q-input>
              <q-input
                outlined
                v-model="permitYear"
                label="Permit Year"
                stack-label
                :dense="dense"
                class="bg-blue-1"
                :rules="[val => !!val || 'Field is required']"
                lazy-rules
              ></q-input>
              <q-input
                outlined
                v-model="issuedBy"
                label="Issued By"
                stack-label
                :dense="dense"
                class="bg-blue-1"
                :rules="[val => !!val || 'Field is required']"
                lazy-rules
              ></q-input>
              <br />
              <q-select
                outlined
                v-model="permitOrg"
                :options="orgOptions"
                stack-label
                label="Organization"
                class="bg-blue-1"
                @input="checkForOther"
                :rules="[val => !!val || 'Field is required']"
                lazy-rules
              />

              <div class="q-pa-md q-gutter-sm">
                <q-input
                  v-if="otherChosen"
                  outlined
                  v-model="permit_info.newOrganization"
                  label="Organization Name"
                  stack-label
                  :dense="dense"
                  class="bg-blue-1"
                  :rules="[val => !!val || 'Field is required']"
                  lazy-rules
                />
              </div>
              <br />
              <q-input
                outlined
                v-model="projectName"
                label="Project Name"
                stack-label
                :dense="dense"
                class="bg-blue-1"
                :rules="[val => !!val || 'Field is required']"
                lazy-rules
              ></q-input>
              <div>
                <br />
                <q-input
                  outlined
                  v-model="principleInvestigator"
                  label="Principle Investigator"
                  stack-label
                  class="bg-blue-1"
                  :rules="[val => !!val || 'Field is required']"
                  lazy-rules
                />
              </div>
            </q-tab-panel>
          </q-tab-panels>

          <br />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="permitDetails" class="bg-cyan-4">
              <q-input
                outlined
                v-model="startDate"
                label="Permit Start"
                stack-label
                class="bg-cyan-1"
                :rules="[val => !!val || 'Field is required']"
                lazy-rules
              >
                <q-menu>
                  <div class="row no-wrap q-pa-md">
                    <q-date v-model="startDate" mask="YYYY-MM-DD" default-view="Years" />
                  </div>
                </q-menu>
              </q-input>

              <q-input
                outlined
                v-model="endDate"
                label="Permit End"
                stack-label
                class="bg-cyan-1"
                bottom-slots
                error-message="Permit end date must be after permit start date"
                :error="!isValid"
                :rules="[val => !!val || 'Field is required']"
                lazy-rules
              >
                <q-menu>
                  <div class="row no-wrap q-pa-md">
                    <q-date v-model="endDate" mask="YYYY-MM-DD" default-view="Years" />
                  </div>
                </q-menu>
              </q-input>
            </q-tab-panel>

            <q-tab-panel name="catchData">
              <div class="text-h6">Alarms</div>Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </q-tab-panel>
          </q-tab-panels>

          <br />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="permitDetails" class="bg-teal-4">
              <div>User Notes</div>
              <q-input v-model="permitNotes" filled type="textarea" class="bg-teal-1" />
              <br />
              <div>Staff Note</div>
              <q-input v-model="staffNotes" filled type="textarea" class="bg-teal-1" />
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
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
      <br />

      <q-dialog v-model="saveModel" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <span class="q-ml-sm">New permit was saved succesfully. Enter another permit?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Yes" color="primary" v-close-popup/>
            <q-btn flat label="No" color="primary" to="/permits" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-btn color="primary" class="justify-center" v-if="!isNew" @click="updatePermitInfo">Save</q-btn>
      <q-btn color="primary" class="justify-center" v-if="isNew" type="submit">Save</q-btn>
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
      <br />
      <div class="q-mt-md">{{ permit }}</div>
      <div class="q-mt-md">Is New: {{ isNew.toString() }}</div>
    </q-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { date } from 'quasar';
import axios from 'axios';

@Component
export default class Permits extends Vue {
  permit_info = {
    pointOfContact: 'Seric Ogaz',
    email: 'trogdor@noaa.gov',
    newOrganization: null
  };
  temp = [{name: ''}];
  originalPermitNum: string = '';
  tab: string = 'permitDetails';
  otherChosen: boolean = false;
  saveSuccesfulBlock = false;
  saveFailedBlock = false;
  saveModel = false;
  errorText = '';
  dense = false;

  // Make the organization name field indented or something to indicate
  // it's a temp field?
  checkForOther() {
    if (this.permitOrg === 'Other') {
      this.otherChosen = true;
    } else {
      this.otherChosen = false;
      this.permit_info.newOrganization = null;
    }
  }

  dateRules(endDate) {
    if (endDate === '') {
      return true;
    } else {
      if (endDate > this.startDate) {
        return true;
      } else {
        return false;
      }
    }
  }

  $refs!: {
    section: HTMLFormElement;
  };

  saveNewPermit() {
    let uploadObject = Object.assign(this.$store.state.sPermit.permit);

    // Handle new organization entry
    if (uploadObject['organization_name'] === 'Other') {
      delete uploadObject['organization_name'];
      uploadObject['new_org'] = this.permit_info.newOrganization;
    }

    // TODO: this is still "editing" the vuex store, fix that
    uploadObject['point_of_contact'] = 0;
    uploadObject['data_status_id'] = 2;

    axios
      .post('http://localhost:8080/api/permits', uploadObject)
      .then(res => {
        console.log(res);
        this.saveFailedBlock = false;
        this.$store.commit('sPermit/clearSPermit');
        this.saveModel = true;
      })
      // TODO: How do I catch a 401 response here?
      .catch(error => {
        console.log(error);
        this.saveFailedBlock = true;
        this.saveSuccesfulBlock = false;
      });
  }

  updatePermitInfo() {
    // Take out the point of contact field (for now, need to handle this later)
    let uploadObject = Object.assign(this.$store.state.sPermit.permit);
    delete uploadObject['point_of_contact'];
    delete uploadObject['delivery_date'];

    // TODO: Handle new organization entry
    if (uploadObject['organization_name'] === 'Other') {
      delete uploadObject['organization_name'];
      uploadObject['new_org'] = this.permit_info.newOrganization;
    }

    axios
      .put('http://localhost:8080/api/permits', uploadObject)
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

  get orgOptions() {
    return this.temp
      .map(function(obj) {
        return obj.name;
      })
      .concat(['Other']);
  }

  get isValid() {
    if (!this.startDate || !this.endDate) {
      return true;
    } else {
      return new Date(this.startDate) < new Date(this.endDate);
    }
  }

  get isPermitNumValid() {
    let re = new RegExp('^(SRP|LOA)-\\d\\d-\\d\\d\\d\\d$');
    return re.test(this.permitNumber);
  }

  // slew of getters and setters to interact with the vuex store
  get isNew() {
    return this.$store.state.sPermit.new;
  }

  get projectId() {
    return this.$store.state.sPermit.permit.research_project_id;
  }
  set projectId(value) {
    this.$store.commit('sPermit/updateProjectId', value);
  }
  get permitNumber() {
    return this.$store.state.sPermit.permit.permit_number;
  }
  set permitNumber(value) {
    this.$store.commit('sPermit/updatePermitNum', value);
  }
  get permitOrg() {
    return this.$store.state.sPermit.permit.organization_name;
  }
  set permitOrg(value) {
    this.$store.commit('sPermit/updateOrg', value);
  }
  get projectName() {
    return this.$store.state.sPermit.permit.project_name;
  }
  set projectName(value) {
    this.$store.commit('sPermit/updateProjectName', value);
  }
  get permitYear() {
    return this.$store.state.sPermit.permit.permit_year;
  }
  set permitYear(value) {
    this.$store.commit('sPermit/updatePermitYear', value);
  }
  get startDate() {
    return date.formatDate(
      this.$store.state.sPermit.permit.start_date,
      'YYYY-MM-DD'
    );
  }
  set startDate(value) {
    this.$store.commit('sPermit/updateStartDate', value);
  }
  get endDate() {
    return date.formatDate(
      this.$store.state.sPermit.permit.end_date,
      'YYYY-MM-DD'
    );
  }
  set endDate(value) {
    this.$store.commit('sPermit/updateEndDate', value);
  }
  get permitMortality() {
    return this.$store.state.sPermit.permit.mortality_credits_applicable;
  }
  set permitMortality(value) {
    this.$store.commit('sPermit/updateMortality', value);
  }
  get issuedBy() {
    return this.$store.state.sPermit.permit.issued_by;
  }
  set issuedBy(value) {
    this.$store.commit('sPermit/updateIssuedBy', value);
  }
  get principleInvestigator() {
    return this.$store.state.sPermit.permit.principle_investigator;
  }
  set principleInvestigator(value) {
    this.$store.commit('sPermit/updatePI', value);
  }
  get permitNotes() {
    return this.$store.state.sPermit.permit.notes;
  }
  set permitNotes(value) {
    this.$store.commit('sPermit/updateNotes', value);
  }
  get staffNotes() {
    return this.$store.state.sPermit.permit.staff_notes;
  }
  set staffNotes(value) {
    this.$store.commit('sPermit/updateStaffNotes', value);
  }

  get permit() {
    return this.$store.state.sPermit.permit;
  }
  set permit(value) {
    this.$store.commit('sPermit/updateSPermit', value);
  }

  created() {
    // TODO: error handeling
    axios
      .get('http://localhost:8080/api/orgNames')
      .then(response => (this.temp = response.data));
    this.originalPermitNum = this.$store.state.sPermit.permit.permit_number;
  }
}
</script>