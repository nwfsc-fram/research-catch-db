<template>
  <div>

    <div class="col-3">Microsoft Excel File Upload</div>
    <q-file
      @input="startIngest($event)"
      class="col-6"
      clearable
      outlined
      v-model="excelFile"
    />
    <div>{{ data }}</div>

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
  email: string | undefined;
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
  // yearModel = ,
  // need year field, check on year field, data displayed
  // in table so lynn can quality check it, and a submit button
  // with a success or failure notification. Hmm, this may actually
  // take a new api/query... should do them as  group, right now the
  // add new permit is only for one.  I could make the current
  // add permit to take mutliple, but it's used slightly differently
  // hmmm. I also did tweak the old add permit, so need
  // to make sure that still works.
  yearModel = 1999;

  cleanData() {
    this.data = [];
    for (var row of this.permitData) {
      if (this.isPermitNum(row.permitNumber)) {
        var newdata: NewPermit = {'permit_number': row.permitNumber,
          'issued_by': row.issuedBy!,
          'principle_investigator': row.leadScientist!,
          'email': row.email!,
          'organization_name': row.organization!,
          'project_name': row.researchDescrip!,
          'permit_year': this.yearModel,
          'data_status_id': 2};

        // Handle dates
        let dates = row.effectDates!.split('-');
        newdata['start_date'] = new Date(dates[0]).toString();
        newdata['end_date'] = new Date(dates[1]).toString();

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
