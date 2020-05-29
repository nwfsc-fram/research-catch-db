// Research Catch Server API
// FRAM Data Team 2020

import express from 'express';
import cors from 'cors';
import { Application } from 'express';

import * as https from 'https';
import { resolve } from 'path';
import moment from 'moment';
import session from 'express-session';

const OpenApiValidator = require('express-openapi-validator').OpenApiValidator;

import { RSA_PRIVATE_KEY, RSA_CERT } from './util/security';
import { validateJwtRequest } from './middleware/get-user.middleware';
import {
  getPermitsView,
  getGroupingList,
  getSpeciesList,
  getSpeciesGrouping,
  getDepthGroupings,
  getOrgNames,
  getPermitId,
  addPermit,
  addCatchData,
  getCatchData,
  deleteCatchData,
  getCatchSGIds,
  updatePermit,
  deletePermit,
  addPermitYearly,
  addNewYearGrouping,
  getGroupYears,
  deleteGroupingSpecies,
  lockAddYear,
  getLockYear,
  deleteGroupSet,
  updateSpeciesGrouping,
  updateGrouping,
  addSpeciesGrouping,
  getReport1,
  getReport2Pnums,
  getReport3
} from './routes/researchcatch.db.route';

const app: Application = express();

const optionDefinitions = [
  { name: 'port', alias: 'p', type: Number},
  { name: 'path', type: String} // Full path, dist/ will be added on
];

const commandLineArgs = require('command-line-args');

const options = commandLineArgs(optionDefinitions);

const PORT = options.port ? options.port : 9200;

app.use(
  session({
    secret: 'unused',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  })
);
app.use(express.json());
app.use(cors());
app.disable('x-powered-by'); // Disable express version sharing

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument =  YAML.load(resolve(__dirname, 'openapi.yaml'));

// OpenAPI Spec
app.use('/spec', express.static(resolve(__dirname, 'openapi.yaml')));
// API Swagger UI
app.use('/rcat/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



new OpenApiValidator({
  apiSpecPath: './src/openapi.yaml'
}).install(app);

const API_VERSION = 'v1';
// REST API

// get BOATNET_OBSERVER users / roles
// TODO: Refactor to collapse calls to validateJwtRequest?

app.use('/rcat/api/' + API_VERSION + '/permits', validateJwtRequest); // validate first
app.route('/rcat/api/' + API_VERSION + '/permits').post(addPermit);
app.route('/rcat/api/' + API_VERSION + '/permits').put(updatePermit);
app.route('/rcat/api/' + API_VERSION + '/permits/:permitnum').delete(deletePermit);

app.use('/rcat/api/' + API_VERSION + '/permitsyearly', validateJwtRequest); // validate first
app.route('/rcat/api/' + API_VERSION + '/permitsyearly').post(addPermitYearly);

app.use('/rcat/api/' + API_VERSION + '/catch', validateJwtRequest);
app.route('/rcat/api/' + API_VERSION + '/catch').post(addCatchData);
app.route('/rcat/api/' + API_VERSION + '/catch/:pid').get(getCatchData);
app.route('/rcat/api/' + API_VERSION + '/catch/:pid').delete(deleteCatchData);

app.use('/rcat/api/' + API_VERSION + '/catchgs', validateJwtRequest);
app.route('/rcat/api/' + API_VERSION + '/catchgs').get(getCatchSGIds);

app.use('/rcat/api/' + API_VERSION + '/groupmanage', validateJwtRequest);
app.route('/rcat/api/' + API_VERSION + '/groupmanage').post(addNewYearGrouping);
app.route('/rcat/api/' + API_VERSION + '/groupmanage').get(getGroupYears);
app.route('/rcat/api/' + API_VERSION + '/groupmanage/:gid').delete(deleteGroupingSpecies);

app.use('/rcat/api/' + API_VERSION + '/lockyear', validateJwtRequest);
app.route('/rcat/api/' + API_VERSION + '/lockyear').put(lockAddYear);
app.route('/rcat/api/' + API_VERSION + '/lockyear').get(getLockYear);

app.use('/rcat/api/' + API_VERSION + '/permitid', validateJwtRequest);
app.route('/rcat/api/' + API_VERSION + '/permitid/:pnum').get(getPermitId);

app.use('/rcat/api/' + API_VERSION + '/permitsview', validateJwtRequest);
app.route('/rcat/api/' + API_VERSION + '/permitsview').get(getPermitsView);

app.use('/rcat/api/' + API_VERSION + '/grouping', validateJwtRequest);
app.route('/rcat/api/' + API_VERSION + '/grouping').put(updateGrouping);
app.route('/rcat/api/' + API_VERSION + '/grouping/:groupingid/:year').delete(deleteGroupSet);
app.route('/rcat/api/' + API_VERSION + '/grouping/:year').get(getGroupingList);

app.use('/rcat/api/' + API_VERSION + '/species', validateJwtRequest);
app.route('/rcat/api/' + API_VERSION + '/species/:year').get(getSpeciesList);

app.use('/rcat/api/' + API_VERSION + '/speciesgrouping', validateJwtRequest);
app.route('/rcat/api/' + API_VERSION + '/speciesgrouping').post(addSpeciesGrouping);
app.route('/rcat/api/' + API_VERSION + '/speciesgrouping').put(updateSpeciesGrouping);
app.route('/rcat/api/' + API_VERSION + '/speciesgrouping/:year').get(getSpeciesGrouping);

app.use('/rcat/api/' + API_VERSION + '/reports', validateJwtRequest);
app.route('/rcat/api/' + API_VERSION + '/reports/report1/:yearstart/:yearend').get(getReport1);
app.route('/rcat/api/' + API_VERSION + '/reports/report2permits/:yearstart/:yearend').get(getReport2Pnums);
app.route('/rcat/api/' + API_VERSION + '/reports/report3/:yearstart/:yearend').get(getReport3);

app.use('/rcat/api/' + API_VERSION + '/depthgroupings', validateJwtRequest);
app.route('/rcat/api/' + API_VERSION + '/depthgroupings').get(getDepthGroupings);

app.use('/rcat/api/' + API_VERSION + '/orgnames', validateJwtRequest);
app.route('/rcat/api/' + API_VERSION + '/orgnames').get(getOrgNames)


// Handle bad requests
app.use((err: any, req: any, res: any, next: any) => {
  if (!err) return next();
  console.log(moment().format(), 'Bad request. ', req.ip, err.message);
  return res.status(400).json({
    status: 400,
    error: 'Bad request.'
  });
});

const httpsServer = https.createServer(
  {
    key: RSA_PRIVATE_KEY,
    cert: RSA_CERT
    // Temporary Keys, not secret and publically shared
    // key: RSA_PRIVATE_KEY,
    // cert: RSA_CERT
  },
  app
);

// launch an HTTPS Server. Note: this does NOT mean that the application is secure
httpsServer.listen(PORT, () => {
  const address: any = httpsServer.address();
  console.log(
    'HTTPS Secure Server running at https://localhost:' + address.port
  );
});
