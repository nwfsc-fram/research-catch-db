<template>
  <div class="q-pa-md q-gutter-md">
    <br />
    <q-card class="q-gutter-md bg-indigo-2">
      <div>
        <p class="text-subtitle2">Welcome to the NWFSC's Research Catch App!</p>



        
        <p>
          The Pacific Fishery Management Council determines the amount of available catch 
          for groundfish research activities each year based on recent averages of annual 
          research catch. The catch data you submit is counted and included in the annual 
          Groundfish Mortality Report and helps inform future set-asides for research catch 
          as well as potential environmental impacts from research activities.
        </p>
        <p>
          To enter your catch data please go to the permit page linked in the left sidebar, 
          and click the check box next to the appropriate permit. Then click the 
          "submit catch data" button at the top. You will then be directed to a page with two 
          tabs, with the catch data tab to the right. For more detailed instructions see below 
          for step by step documentation.
        </p>
        <p>
          The species and management groupings in this database reflect the Pacific Fishery 
          Management Council's groupings in the year the catch occurred. These groupings often 
          change slightly every two years to reflect management changes, so you may need to update 
          categories to reflect these alterations.  Only fish managed under the Groundfish Fishery 
          Management Plan or identified as Shared Ecosystem Component species need to be reported.
        </p>
        <p>
          If your catch was speciated to a finer level than the groupings included here, please 
          combine into the larger category in the database. Similarly, “Unid” grouping categories 
          account for catch that did or could not be categorized into a more specific sub-category. 
          For example, sometimes nearshore rockfish are caught but not recorded under their specific 
          sub-species. In this instance the nearshore rockfish unid category can be used to list 
          this catch.
        </p>
          If a groundfish or Shared Ecosystem Component species or grouping is not included in 
          the database and a larger category is not appropriate, please contact Kate Richerson 
          (kate.e.richerson@noaa.gov) and Kayleigh Somers (kayleigh.somers@noaa.gov).  A complete 
          list of fish managed under the Groundfish Fishery Management Plan or identified as 
          Shared Ecosystem Component species can be found in section 3.1 of the 
          <a href="https://www.pcouncil.org/documents/2016/08/pacific-coast-groundfish-fishery-management-plan.pdf/">Pacific Coast Groundfish Fishery Management Plan</a>. 
        <p>

        </p>
      </div>
    </q-card>

    <q-card class="q-gutter-md bg-blue-2">
      <div class="text-h6">FAQs</div>
      <div>
        <p class="text-subtitle2">What are mortality credits?</p>
        <p>
          For a few species (cowcod, yelloweye, and canary rockfish) 
          that were caught with hook and line gear and released at depth using a descending device, 
          we assume that mortality is less then 100%. The mortality rate for each species depends on the 
          depth of capture. If your study had cowcod, yelloweye, and/or canary rockfish caught with hook 
          and line and released at depth, please include the appropriate information (depth captured and 
          percent released at depth) so that we can calculate the appropriate estimated mortality. You 
          do not need to include this information for any other species or gear.
        </p>
        <p class="text-subtitle2">What are the unid groupings?</p>
        <p>
          Unid grouping categories are for recorded catch that did or could not be categorized
          into a more specific sub-category. For example, sometimes nearshore rockfish are caught
          but not recorded under their specific sub-species. In this instance the nearshore rockfish unid
          category can be used to list this catch.
        </p> 
      </div>
    </q-card>

    <q-card class="q-gutter-md bg-cyan-2">
      <q-card-actions>
        <div class="text-h6">Catch Submission Guide</div>

        <q-btn
          color="grey"
          round
          flat
          dense
          :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          @click="expanded = !expanded"
        />
      </q-card-actions>

      <q-slide-transition>
        <div v-show="expanded">
          <q-separator />
          <q-card-section class="text-subitle2">
            Users can submit research catch reporting numbers through this application.
            Below you will find a walkthrough with screenshots of the submission process.
          </q-card-section>

          <p>To navigate to the permit listing table, use the left navigation bar. Click on the "Permits" menu item.</p>
          <q-img src="permits_tab.png" />
          <br />
          <br />
          <br />
          <p>
            Select the permit you wish to submit catch data for. The table will display in pages,
            which can be navigated using the buttons on the bottom right of the table. The table
            entries can also be sorted by various columns using the arrows to the right of the
            column headings. The table entries can also be filtered using the search bar at the top right
            of the table. Once the desired permit is found, click the checkbox to the left of the permit
            row and press "SUBMIT CATCH DATA" at the top left of the table.
          </p>
          <q-img src="choose_permit.png" />
          <br />
          <br />
          <br />
          <p>
            The permit details page has two tabs. At the bottom of the first tab, "PERMIT DETAILS", there
            is a User Entry section, where users may add any notes, and change the status of the "mortality credits applicable"
            field. The "mortality credits applicable" status is always set to false when permits are first entered into the system,
            so make sure to update this field if needed. To save these changes, press the "SAVE" button at the bottom of the page.
          </p>
          <q-img src="permit_details.png" />
          <br />
          <br />
          <br />
          <p> 
            To navigate to the catch submission tab click the "CATCH DATA" tab at the top of the page. Towards 
            the top of this tab you will see a "Microsoft Excel File Upload" field. When the empty input field is 
            clicked a file system navigation window will pop up. Choose the Microsoft Excel catch data sheet for 
            the year of the permit (after filling in all appropriate data in the spreadsheet) and click open. 
            The spreadsheet data will load further down the page in the "Table Entry" section.
          </p>
          <q-img src="file_upload.png" />
          <br />
          <br />
          <br />
          <p> 
            Once the data is loaded into the "Table Entry" table, entries should be checked for potential 
            submission errors. Any grouping and species fields that do not match the groupings for that year 
            will be highlighted in red. This may indicate that you have used an Excel catch data sheet from 
            an incorrect year. As with the permit table, the catch data table can be navigated using the 
            buttons on the bottom right of the table. Once all entries have been checked for correctness, 
            submit the catch data with the "SUBMIT CATCH DATA" button on the bottom of the page.
          </p>
          <q-img src="catch_data_qa.png" />
          <br />
          <br />
          <br />
          <p> 
            If an error occurs during the catch data submission, a popup will appear on the screen. Further 
            details about the error will be shown at the bottom of the page. If the error was caused by 
            incorrect data input, details about the data will be shown in this error details section. Once 
            the incorrect data is fixed, use the "SUBMIT CATCH DATA" to try and submit again. The catch data 
            submission can be attempted as many times as needed to fix all data input errors. But keep in mind 
            that a successful submission will overwrite any previously submitted data.
          </p>
          <q-img src="submission_error.png" />
          <br />
          <br />
          <br />
          <p> 
            If a user would prefer to submit their catch data by hand, instead of using the Microsoft Excel 
            catch data sheet, a new blank row can be added to the catch data table by using the "ADD ROW" 
            button at the bottom center of the table. Once a new row is added, the grouping and species can 
            be chosen from drop down menus by clicking into the field. The other table fields can also be 
            filled out by clicking on the desired field and filling out the data as directed. This method of 
            catch data submission may be useful for research permits that catch a limited number of different 
            species. Once all catch data has been entered into the table, the submission process can be completed 
            as shown above, by pressing the "SUBMIT CATCH DATA" button at the bottom of the table.
          </p>
          <q-img src="add_row.png" />
        </div>
      </q-slide-transition>
    </q-card>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import Vue from 'vue';
import Component from 'vue-class-component';
import { authService } from '@boatnet/bn-auth/lib';

@Component
export default class Home extends Vue {
  authConfig: object = {};
  expanded: boolean = false;
  lorem: string = 'Lorem ipsum dolor sit';

  mounted() {
    axios.defaults.baseURL = 'https://www.devwebapps.nwfsc.noaa.gov/gf-research-permits';
    const token = authService.getCurrentUser()!.jwtToken!;
    this.authConfig = { headers: { Authorization: `Bearer ${token}` } };
  }
}
</script>
