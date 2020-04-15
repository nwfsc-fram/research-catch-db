<template>
  <div class="q-gutter-md q-pa-md">
    <div class="row">
      <div class="col-3">
        <q-input
          outlined
          v-model.number="yearModel"
          label="Year"
          type="number"
          stack-label
          @blur="yearChanged"
        ></q-input>
      </div>
    </div>
    <div>Microsoft Excel File Upload (.xlsx file)</div>
    <div class="row">
      <div class="col-6">
        <q-file @input="startIngest($event)" clearable outlined v-model="excelFile" />
      </div>
    </div>

    <q-table
      :data="data"
      :columns="columns"
      title="Upload Preview"
      row-key="permit_number"
      virtual-scroll
      :pagination.sync="pagination"
      :rows-per-page-options="[0]"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="permitNumber" :props="props">
            {{ props.row.permit_number }}
            <q-popup-edit v-model="props.row.permit_number" buttons>
              <q-input v-model="props.row.permit_number" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="issuedBy" :props="props">
            {{ props.row.issued_by }}
            <q-popup-edit v-model="props.row.issued_by" buttons>
              <q-input v-model="props.row.issued_by" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="principleInvestigator" :props="props">
            {{ props.row.principle_investigator }}
            <q-popup-edit v-model="props.row.principle_investigator" buttons>
              <q-input v-model="props.row.principle_investigator" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="email" :props="props">
            {{ props.row.email }}
            <q-popup-edit v-model="props.row.email" buttons>
              <q-input v-model="props.row.email" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="organizationName" :props="props">
            {{ props.row.organization_name }}
            <q-popup-edit v-model="props.row.organization_name" buttons>
              <q-input v-model="props.row.organization_name" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="projectName" :props="props">
            <div class="my-table-details">{{ props.row.project_name }}</div>
            <q-popup-edit v-model="props.row.project_name" buttons>
              <q-input v-model="props.row.project_name" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="permitYear" :props="props">
            {{ props.row.permit_year }}
            <q-popup-edit v-model="props.row.permit_year" buttons>
              <q-input v-model="props.row.permit_year" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="startDate" :props="props">
            {{ props.row.start_date }}
            <q-popup-edit v-model="props.row.start_date" buttons>
              <q-input v-model="props.row.start_date" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="endDate" :props="props">
            {{ props.row.end_date }}
            <q-popup-edit v-model="props.row.end_date" buttons>
              <q-input v-model="props.row.end_date" dense autofocus />
            </q-popup-edit>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-btn color="positive" label="Upload" :disable="data.length < 1" @click="uploadPermits" />

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
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import axios from 'axios';
import XLSX from 'xlsx';
import { authService } from '@boatnet/bn-auth/lib';

interface ExcelRow {
  permitNumber: string;
  issuedBy: string | undefined;
  leadScientist: string | undefined;
  emailContact: string | undefined;
  organization: string | undefined;
  effectDates: string | undefined;
  researchDescrip: string | undefined;
}

interface NewPermit {
  permit_number: string;
  issued_by: string;
  principle_investigator: string;
  email: string;
  organization_name: string;
  start_date?: string;
  end_date?: string;
  project_name: string;
  permit_year: number;
  data_status_id: number;
}

@Component
export default class PermitUpload extends Vue {
  authConfig: object = {};
  excelFile = null;
  tableLoading = false;
  data: NewPermit[] = [];
  permitData: ExcelRow[] = [];
  yearModel: number = new Date().getFullYear() + 1;
  saveSuccesfulBlock = false;
  saveFailedBlock = false;
  errorMessage = '';

  pagination = {
    rowsPerPage: 0
  };
  columns = [
    {
      name: 'permitNumber',
      label: 'Permit Number',
      field: 'permit_number',
      sortable: true
    },
    {
      name: 'issuedBy',
      label: 'Issued By',
      field: 'issued_by',
      sortable: true
    },
    {
      name: 'principleInvestigator',
      label: 'Principle Investigator',
      field: 'principle_investigator',
      sortable: true
    },
    {
      name: 'email',
      label: 'PI Email',
      field: 'email',
      sortable: true
    },
    {
      name: 'organizationName',
      label: 'Organization',
      field: 'organization_name',
      sortable: true
    },
    {
      name: 'projectName',
      label: 'Project',
      field: 'project_name',
      sortable: true
    },
    {
      name: 'permitYear',
      label: 'Permit Year',
      field: 'permit_year'
    },
    {
      name: 'startDate',
      label: 'Start Date',
      field: 'start_date',
      sortable: true
    },
    {
      name: 'endDate',
      label: 'End Date',
      field: 'end_date',
      sortable: true
    }
  ];

  uploadPermits() {
    // do a thing
    let uploadObject = { upload_data: this.data };
    axios
      .post('rcat/api/v1/permitsyearly', uploadObject, this.authConfig)
      .then(res => {
        console.log(res);
        this.saveFailedBlock = false;
        this.saveSuccesfulBlock = true;
      })
      .catch(error => {
        console.log(error.response.data.message);
        this.errorMessage =
          'could not save new permits to database:' +
          error.response.data.message;
        this.saveFailedBlock = true;
        this.saveSuccesfulBlock = false;
      });
  }

  yearChanged() {
    for (var permit of this.data) {
      permit.permit_year = this.yearModel;
    };
  }

  cleanData() {
    this.data = [];
    for (var row of this.permitData) {
      if (this.isPermitNum(row.permitNumber)) {
        var newdata: NewPermit = {
          permit_number: row.permitNumber,
          issued_by: row.issuedBy!,
          principle_investigator: row.leadScientist!,
          email: row.emailContact!,
          organization_name: row.organization!,
          project_name: row.researchDescrip!,
          permit_year: this.yearModel,
          data_status_id: 2
        };

        // Handle dates
        let dates = row.effectDates!.split('-');
        newdata['start_date'] = new Date(dates[0]).toDateString();
        newdata['end_date'] = new Date(dates[1]).toDateString();

        this.data.push(newdata);
      }
    }
  }

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

  handleLoading(e) {
    let data = new Uint8Array(e.target.result);
    var workbook = XLSX.read(data, { type: 'array' });
    let worksheet = workbook.Sheets[workbook.SheetNames[0]];
    this.permitData = XLSX.utils.sheet_to_json(worksheet, {
      header: [
        'permitNumber',
        'nanotes',
        'issuedBy',
        'leadScientist',
        'emailContact',
        'organization',
        'effectDates',
        'nalastCatchReport',
        'researchDescrip'
      ]
    });
    // temporarily changing this from 2 to 3, for 2019 catch data testing
    this.cleanData();
  }

  isPermitNum(permitNumber) {
    let re = new RegExp('^(SRP|LOA)-\\d\\d-\\d\\d\\d\\d$');
    return re.test(permitNumber);
  }

  mounted() {
    const token = authService.getCurrentUser()!.jwtToken!;
    this.authConfig = { headers: { Authorization: `Bearer ${token}` } };
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
