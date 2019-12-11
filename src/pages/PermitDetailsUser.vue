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
                  >{{ permit_info.pointOfContact }}</div>
                </template>
              </q-field>
              <q-field square outlined label="Email Address" stack-label class="bg-indigo-1">
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
            <q-field outlined label="Permit Number" stack-label square class="bg-blue-1">
              <template v-slot:control>
                <div class="full-width no-outline">{{ permit_info.permitNum }}</div>
              </template>
            </q-field>

            <q-field outlined label="Organization" stack-label class="bg-blue-1">
              <template v-slot:control>
                <div class="full-width no-outline">{{ permit_info.organization }}</div>
              </template>
            </q-field>

            <q-field outlined label="Principle Investigator" stack-label class="bg-blue-1">
              <template v-slot:control>
                <div class="full-width no-outline">{{ permit_info.pi }}</div>
              </template>
            </q-field>
          </q-tab-panel>
        </q-tab-panels>

        <br />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="permitDetails" class="bg-cyan-4">
            <q-input
              outlined
              v-model="permit_info.cruiseStart"
              label="Cruise Start"
              stack-label
              class="bg-cyan-1"
              readonly
            >
              <q-menu>
                <div class="row no-wrap q-pa-md">
                  <q-date v-model="permit_info.cruiseStart" default-view="Years" />
                </div>
              </q-menu>
            </q-input>

            <q-input
              outlined
              v-model="permit_info.cruiseEnd"
              label="Cruise End"
              stack-label
              readonly
              class="bg-cyan-1"
              :rules="[val => val > permit_info.cruiseStart || 'Cruise end date must be after cruise start date']"
            >
              <q-menu>
                <div class="row no-wrap q-pa-md">
                  <q-date v-model="permit_info.cruiseEnd" default-view="Years" />
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
            <div>Notes</div>
            <q-input v-model="permit_info.noteText" filled type="textarea" class="bg-teal-1" />
            <br />
            <q-card class="bg-teal-1 q-pa-md">
              <div class="row">
                <p class="col-5">Mortality Credits Applicable:</p>
                <q-btn-toggle
                  v-model="permit_info.mortalityApplicable"
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

    <q-btn color="primary" class="justify-center">Save</q-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
//import { date } from 'quasar';
import axios from 'axios';

@Component
export default class Permits extends Vue {
  permit_info = {
    pointOfContact: 'Seric Ogaz',
    email: 'trogdor@noaa.gov',
    permitNum: '',
    organization: null,
    newOrganization: null,
    pi: null,
    cruiseStart: null,
    cruiseEnd: null,
    noteText: null,
    mortalityApplicable: false
  };

  data = [];
  temp = [];

  dense = false;
  filter = '';
  selected = [];
  tab = 'permitDetails';
  otherChosen = false;

  //save button needs to check if any values were actually updated
  //and handle if org="other" carefully

  created() {
    axios
      .get('http://localhost:8080/api/orgNames')
      .then(response => (this.temp = response.data));
  }
}
</script>