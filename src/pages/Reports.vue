<template>
  <div class="q-gutter-md">
    <br />
    <div class="row justify-center q-gutter-md">
      <q-select
        class="col-3"
        outlined
        v-model="startYearModel"
        :options="yearList"
        label="Start Year"
        stack-label
      />
      <q-select
        class="col-3"
        outlined
        v-model="endYearModel"
        :options="yearList"
        label="End Year"
        stack-label
      />
    </div>

    <div class="row justify-center q-gutter-md">
      <q-btn color="primary" label="Detailed Catch Report" @click="getReport1"/>
      <q-btn color="primary" label="Tabulated Catch Report" @click="getReport2"/>
      <q-btn color="primary" label="Permit Summary Report" @click="getWcrReport"/>
    </div>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import axios from 'axios';
import { authService } from '@boatnet/bn-auth/lib';
import { exportFile } from 'quasar';

interface ETLDataObj {
  [someStrKeyDynamic:string]:{
    rowStr: string;
    total: number;
  } | {
    [someStrKeyDynamic:string]: number; 
  };
};

interface PermitReturn {
  permit_number: string;
  permit_year: number;
};

@Component
export default class Reports extends Vue {
  startYearModel: number = 2019;
  endYearModel: number = 2019;
  yearList: number[] = [];
  authConfig: object = {};
  rawData = [];
  rawPermitList: PermitReturn[] = [];
  permitList: string[] = [];
  csvData = '';
  status: Error | boolean = true;
  temp: ETLDataObj[] = [];

  async getReport1() {
    try {
      await axios
        .get(`rcat/api/v1/reports/report1/${this.startYearModel}/${this.endYearModel}`, 
          this.authConfig)
        .then(response => (this.rawData = response.data))
        .catch(error => {
          console.log(error.response.data.message);
        });
    } catch (error) {
      console.log('error', error);
      this.$q.notify({
        message:
          'Unknown error, failed to retrieve report data',
        color: 'red'
      });
      return;
    }

    // Translate JSON to csv data
    const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
    const header = Object.keys(this.rawData[0])
    let csv = this.rawData.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    csv.unshift(header.join(','))
    this.csvData = csv.join('\r\n')

    // Export
    this.status = exportFile('ReportCatchDetailed.csv', this.csvData);
  }

  async getReport2() {
    // Report 2, tabulated

    // part one - get SRPs array in year order
    try {
      await axios
        .get(`rcat/api/v1/reports/report2permits/${this.startYearModel}/${this.endYearModel}`, 
          this.authConfig)
        .then(response => (this.rawPermitList = response.data))
        .catch(error => {
          console.log(error.response.data.message);
        });
      this.permitList = this.rawPermitList.map(x => x.permit_number);
      console.log(this.permitList);
    } catch (error) {
      console.log('error', error);
      this.$q.notify({
        message:
          'Unknown error, failed to retrieve report data',
        color: 'red'
      });
      return;
    }

    // part two - fill in data array for ETL
    try {
      await axios
        .get(`rcat/api/v1/reports/report1/${this.startYearModel}/${this.endYearModel}`, 
          this.authConfig)
        .then(response => (this.rawData = response.data))
        .catch(error => {
          console.log(error.response.data.message);
        });
    } catch (error) {
      console.log('error', error);
      this.$q.notify({
        message:
          'Unknown error, failed to retrieve report data',
        color: 'red'
      });
      return;
    }

    let header = 'Group Name, Species Name, year, ';
    let dataHolder: ETLDataObj = {};

    for (let objRow of this.rawData) {
      let key = objRow['grouping_name'] + objRow['common_name'] + objRow['permit_year'];

      // initialize data rows if first time hitting grouping/species/year
      if (!(key in dataHolder)){
        dataHolder[key] = {rowStr: `${objRow['grouping_name']}, ${objRow['common_name']}, ${objRow['permit_year']}, `, total: 0};
      }

      // now add data
      dataHolder[key][objRow['permit_number']] = objRow['catch_including_mortality'];
      dataHolder[key].total! += objRow['catch_including_mortality'];
    }

    // Step 3 - Re-loop to finish out building strings

    // first take care of header
    for (let pnum of this.permitList) {
      header = header.concat(pnum + ', ');
    }
    header = header.concat('Total Catch Incl Mortality' + '\r\n');

    // now take care of rows
    let dataString = '';
    for (let innerObj of Object.values(dataHolder)) {
      for (let pnum of this.permitList) {
        if (innerObj[pnum]) {
          innerObj.rowStr = String(innerObj.rowStr).concat(String(innerObj[pnum]) + ', ');
        } else {
          innerObj.rowStr = String(innerObj.rowStr).concat(', ');
        }
      }
      dataString = dataString.concat(`${innerObj.rowStr}${innerObj.total}\r\n`)
    }

    // step 4 - now save out data string!
    this.csvData = header + dataString
    this.status = exportFile('ReportCatchTabulated.csv', this.csvData);

  }

  async getWcrReport() {
    try {
      await axios
        .get(`rcat/api/v1/reports/report3/${this.startYearModel}/${this.endYearModel}`, 
          this.authConfig)
        .then(response => (this.rawData = response.data))
        .catch(error => {
          console.log(error.response.data.message);
        });
    } catch (error) {
      console.log('error', error);
      this.$q.notify({
        message:
          'Unknown error, failed to retrieve report data',
        color: 'red'
      });
      return;
    }

    // Translate JSON to csv data
    const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
    const header = Object.keys(this.rawData[0])
    let csv = this.rawData.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    csv.unshift(header.join(','))
    this.csvData = csv.join('\r\n')

    // Export
    this.status = exportFile('ReportPermitSummary.csv', this.csvData);
  }

  mounted() {
    const token = authService.getCurrentUser()!.jwtToken!;
    this.authConfig = { headers: { Authorization: `Bearer ${token}` } };
    axios
      .get('rcat/api/v1/groupmanage', this.authConfig)
      .then(response => (this.yearList = response.data.map(a => a.year)))
      .catch(error => {
        console.log(error.response.data.message);
      });
  }
}
</script>
