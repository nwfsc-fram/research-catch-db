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
                  <div class="full-width no-outline">{{ pointOfContact }}</div>
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
                  <div class="full-width no-outline">trogdor@noaa.gov</div>
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
              v-model="text"
              label="SRP Number"
              stack-label
              :dense="dense"
              class="bg-blue-1"
              bottom-slots
            >
              <template v-slot:hint>Expected Format: SRP-##-####</template>
            </q-input>
            <br />
            <q-input
              outlined
              v-model="text"
              label="SRP Number"
              stack-label
              :dense="dense"
              class="bg-blue-1"
              placeholder="SRP-##-####"
            />
            <br />
            <q-input
              outlined
              v-model="text"
              label="SRP Number"
              stack-label
              :dense="dense"
              class="bg-blue-1"
            >
              <q-tooltip>Expected format for SRP Number is SRP-##-####</q-tooltip>
            </q-input>
            <br />
            <q-select
              outlined
              v-model="organization"
              :options="orgOptions"
              stack-label
              label="Organization"
              class="bg-blue-1"
              @input="checkForOther"
            />
            <div class="q-pa-md q-gutter-sm">
              <q-input
                v-if="otherChosen"
                outlined
                v-model="text"
                label="Organization Name"
                stack-label
                :dense="dense"
                class="bg-blue-1"
              />
            </div>
            <div class="row justify-between">
              <div class="col-8">
                <q-input
                  outlined
                  v-model="pi"
                  label="Principle Investigator"
                  stack-label
                  class="bg-blue-1"
                />
              </div>
              <div class="col-3">
                <q-btn color="primary" @click="pi=pointOfContact">
                  Same as Point
                  <br />of Contact
                </q-btn>
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>

        <br />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="permitDetails" class="bg-cyan-4">
            <q-input
              outlined
              v-model="cruiseStart"
              label="Cruise Start"
              stack-label
              class="bg-cyan-1"
              readonly
            >
              <q-menu>
                <div class="row no-wrap q-pa-md">
                  <q-date v-model="cruiseStart" default-view="Years" />
                </div>
              </q-menu>
            </q-input>

            <q-input
              outlined
              v-model="cruiseEnd"
              label="Cruise End"
              stack-label
              readonly
              class="bg-cyan-1"
              :rules="[val => val > cruiseStart || 'Cruise end date must be after cruise start date']"
            >
              <q-menu>
                <div class="row no-wrap q-pa-md">
                  <q-date v-model="cruiseEnd" default-view="Years" />
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
            <q-input v-model="text" filled type="textarea" class="bg-teal-1" />
            <br />
            <q-card class="bg-teal-1 q-pa-md">
              <div class="row">
                <p class="col-5">Mortality Credits Applicable:</p>
                <q-btn-toggle
                  v-model="mortalityApplicable"
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
                <br />2. Depth of capture must be recorded
                <br />3. Only applies to Canary rockfish, Yelloweye rockfish, & Cowcod
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
import { date } from 'quasar';
//import axios from 'axios';

@Component
export default class Permits extends Vue {
  filter = '';
  selected = [];
  tab = 'permitDetails';
  data = [];
  dense = false;
  pi = '';
  date = null;
  cruiseStart = null;
  cruiseEnd = null;
  mortalityApplicable = false;

  text = '';

  pointOfContact = 'Seric Ogaz';
  organization = null;
  otherChosen = false;
  // options needs to be replaced with a pull from the DB
  orgOptions = ['NWFSC/FRAM', 'Crab Academy'].concat(['Other']);

  // Make the organization name filed indented or something to indicate it's a temp field?
  checkForOther() {
    if (this.organization === 'Other') {
      this.otherChosen = true;
    } else {
      this.otherChosen = false;
    }
  }

  //save button needs to check if any values were actually updated

  mounted() {
    //
  }
}
</script>