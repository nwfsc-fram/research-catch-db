<template>
  <div class="q-pa-md">
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
          <q-tab-panel name="permitDetails" class="bg-indigo-4">
            <div>
              <div>Assigning point of contact to data submission:</div>
              <q-field outlined label="Point of Contact" stack-label square class="bg-indigo-1">
                <template v-slot:control>
                  <div
                    class="self-center full-width no-outline"
                    tabindex="0"
                  >{{ pointOfContact }}</div>
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
            <div class="text-h6">Alarms</div>Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>
        </q-tab-panels>

        <br />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="permitDetails" class="bg-blue-4">
            <q-field outlined label="Permit Number" stack-label square class="bg-blue-1">
              <template v-slot:control>
                <div class="full-width no-outline">{{ permit['permit_number'] }}</div>
              </template>
            </q-field>

            <q-field outlined label="Organization" stack-label class="bg-blue-1">
              <template v-slot:control>
                <div class="full-width no-outline">{{ permit['organization_name'] }}</div>
              </template>
            </q-field>

            <q-field outlined label="Principle Investigator" stack-label class="bg-blue-1">
              <template v-slot:control>
                <div class="full-width no-outline">{{ permit['principle_investigator'] }}</div>
              </template>
            </q-field>
          </q-tab-panel>
        </q-tab-panels>

        <br />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="permitDetails" class="bg-cyan-4">
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
            <div class="text-h6">Alarms</div>Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>
        </q-tab-panels>

        <br />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="permitDetails" class="bg-teal-4">
            <font size="4">User Entry</font>
            <br>
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
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
    <br />

    <q-btn color="primary" class="justify-center" @click="updatePermitInfo">Save</q-btn>
    <br>
    <br>
    <q-card class="bg-green" v-if="saveSuccesfulBlock"> <q-card-section><div>Save was successful</div></q-card-section></q-card>
    <q-card class="bg-red" v-if="saveFailedBlock"> <q-card-section><div>Save unsucessful</div></q-card-section></q-card>
    <br>
    <div class="q-mt-md">{{ permit }}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { date } from 'quasar';
import axios from 'axios';

@Component
export default class Permits extends Vue {

  // to-do: poc and email will need to be hooked up to
  // login acccount
  pointOfContact = 'Seric Ogaz';
  email = 'trogdor@noaa.gov';
  data = [];

  dense = false;
  filter = '';
  selected = [];
  tab = 'permitDetails';
  otherChosen = false;
  saveSuccesfulBlock = false;
  saveFailedBlock = false;

  updatePermitInfo() {
    // Take out the point of contact field
    let uploadObject = Object.assign(this.$store.state.sPermit.permit);
    delete uploadObject['point_of_contact'];

    axios.put('http://localhost:8080/api/permits', uploadObject)
      .then(res => {
        console.log(res);
        this.saveSuccesfulBlock = true;
        this.saveFailedBlock = false;
      })
      .catch(error => {
        console.log(error);
        this.saveFailedBlock = true;
        this.saveSuccesfulBlock = false;
      })
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
    this.$store.commit('sPermit/updateSPermit', value)
  }
}
</script>
