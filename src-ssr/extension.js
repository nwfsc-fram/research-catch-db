/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 *
 * All content of this folder will be copied as is to the output folder. So only import:
 *  1. node_modules (and yarn/npm install dependencies -- NOT to devDependecies though)
 *  2. create files in this folder and import only those with the relative path
 *
 * Note: This file is used for both PRODUCTION & DEVELOPMENT.
 * Note: Changes to this file (but not any file it imports!) are picked up by the
 * development server, but such updates are costly since the dev-server needs a reboot.
 */


const Pool = require('pg').Pool
const express = require('express')
const dbConfig = require('./dbconfig').dbConfig;

const pool = new Pool(dbConfig)

const getPermitsView = async (request, response) => {
  pool.query('SELECT * FROM research_catch."PERMITS_APP_VIEW"', (error, results) => {
    if (error) {
      console.error(error.stack);
      response.status(401).json({
        status: 401,
        message: error.message
      });
    } else {
      response.status(200).json(results.rows)
    }
  })
}

const getGrouping = async (request, response) => {
  pool.query('SELECT * FROM research_catch."GROUPING"', (error, results) => {
    if (error) {
      console.error(error.stack);
      response.status(401).json({
        status: 401,
        message: error.message
      });
    } else {
      response.status(200).json(results.rows)
    }
  })
}

// Get the list of org names in the ORGANIZATION_LU table
const getOrgNames = async (request, response) => {
  pool.query('SELECT name FROM "ORGANIZATION_LU"', (error, results) => {
    if (error) {
      console.error(error.stack);
      response.status(401).json({
        status: 401,
        message: error.message
      });
    }
    response.status(200).json(results.rows)
  })
}

// Get the maximum used research id value
async function getMaxResearchId() {
  let output = null;
  try{
    output = await pool.query('SELECT max(research_project_id) FROM "RESEARCH_PROJECT"');
  } catch (err) {
    console.log(err.stack);
  }

  return output.rows[0];
}

// Get an org id value for a given org name
async function getOrgId(orgName) {
  let output = null;
  try{
    output = await pool.query('SELECT organization_id FROM "ORGANIZATION_LU" WHERE name =$1', [orgName]);
  } catch (err) {
    console.log(err.stack);
  }

  return output.rows[0];
}

// Get a user id value for a given email
async function getUserId(email) {
  let output = null;
  try{
    output = await pool.query('SELECT user_id FROM "USER" WHERE email_address =$1', [email]);
  } catch (err) {
    console.log(err.stack);
  }

  return output.rows[0];
}

// Get the data_status_id from the data status look up
async function getStatusId(status) {
  let output = null;
  try{
    output = await pool.query('SELECT data_status_id FROM "DATA_STATUS_LU" WHERE status_string =$1', [status]);
  } catch (err) {
    console.log(err.stack);
  }

  return output.rows[0];
}

/* 
Update any permit entry. This function is picky about what the input 
parameters are named and translates regular meaninful field values to 
their id values in the DB tables when needed. 
 */
const updatePermit = async (request, response) => {
  const entries = Object.entries(request.body)

  let sqlString = 'UPDATE "RESEARCH_PROJECT" SET '

  let orgReturn = null;
  let userReturn = null;
  let statusReturn = null;

  // This function should be able to handle any possible changes to
  // the research_project table, this means a lot of field handleing
  // and translating values to ids 
  for (const kset of entries) {
    if (kset[0] === 'organization_name') {
      try{
        orgReturn = await getOrgId(kset[1]);
        sqlString = sqlString.concat('organization_id=', orgReturn['organization_id'], ',');
      } catch (err) {
        console.log(err.stack);
      }
    }
    else if (kset[0] === 'email_address') {
      try{
        userReturn = await getUserId(kset[1]);
        sqlString = sqlString.concat('point_of_contact=', userReturn['user_id'], ',');
      } catch (err) {
        console.log(err.stack);
      }
    }
    else if (kset[0] === 'data_status') {
      try{
        statusReturn = await getStatusId(kset[1]);
        sqlString = sqlString.concat('data_status_id=', statusReturn['data_status_id'], ',');
      } catch (err) {
        console.log(err.stack);
      }
    }
    // handle normal fields
    else if (['permit_year', 'mortality_credits_applicable'].includes(kset[0])) {
      sqlString = sqlString.concat(kset[0],'=',kset[1],',')
    }
    else if (kset[0] != 'permit_number') {
      sqlString = sqlString.concat(kset[0],'=\'',kset[1],'\',')
    }
  }

  sqlString = sqlString.slice(0, -1)
  sqlString = sqlString.concat(' WHERE permit_number = \'',request.body.permit_number,'\'')

  // Final query to update the row in the DB
  pool.query(sqlString, [], (error, result) => {
    if (error) {
      console.error(error.stack);
      response.status(401).json({
        status: 401,
        message: error.message
      });
    }
    // this isn't returning anything, not sure why since this example is in the docs...
    else {
      response.status(201).send(`Permit row updated: ${result.rows[0]}`)
    }
  })
}

/*
This function can be used to add a new permit entry to
the RESEARCH_PROJECT table. Does not require all fields
to have values in the API call, it will automatically
asign nulls to missing fields. Translates regular 
meaningful field values to their id values when appropriate
*/
const addPermit = async (request, response) => {
  const result = {
    permitNumber: request.body.permitNumber,
    organizationName: request.body.organizationName,
    projectName: request.body.projectName,
    permitYear: request.body.permitYear,
    startDate: request.body.startDate,
    endDate: request.body.endDate,
    mortalityCreditsApplicable: request.body.mortalityCreditsApplicable,
    email: request.body.email,
    dataStatus: request.body.dataStatus,
    deliveryDate: request.body.deliveryDate,
    issuedBy: request.body.issuedBy,
    principleInvestigator: request.body.principleInvestigator,
    notes: request.body.notes
  }
  // Get a new unused number for the research_project_id value
  let maxReturn = await getMaxResearchId();
  let researchProjectId = Number(maxReturn['max']) + 1

  // Translate values to Ids
  let orgReturn = null;
  let userReturn = null;
  let statusReturn = null;
  if (result.organizationName) {
    try{
      orgReturn = await getOrgId(result.organizationName);
      result.organizationID = orgReturn['organization_id'];
    } catch (err) {
      console.log(err.stack);
    }
  }
  if (result.email) {
    try{
      userReturn = await getUserId(result.email);
      result.pointOfContact = userReturn['user_id'];
    } catch (err) {
      console.log(err.stack);
    }
  }
  if (result.dataStatus) {
    try{
      statusReturn = await getStatusId(result.dataStatus);
      result.dataStatusId = statusReturn['data_status_id'];
    } catch (err) {
      console.log(err.stack);
    }
  }

  pool.query('INSERT INTO "RESEARCH_PROJECT" VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)',
    [researchProjectId, result.permitNumber, result.organizationId,
      result.projectName, result.permitYear, result.startDate,
      result.endDate, result.mortalityCreditsApplicable, result.pointOfContact,
      result.dataStatusId, result.deliveryDate, result.issuedBy,
      result.principleInvestigator, result.notes], (error, result) => {
      if (error) {
        console.error(error.stack);
        response.status(401).json({
          status: 401,
          message: error.message
        });
      }
      // this isn't returning anything, not sure why since this example is in the docs...
      else {
        response.status(201).send(`Permit row added: ${result.rows[0]}`)
      }
    })
}

const deletePermit = (request, response) => {
  const result = {
    permitNum: request.body.permitNum
  };

  pool.query('DELETE FROM "RESEARCH_PROJECT" WHERE permit_number = $1',
    [result.permitNum], (error, result) => {
      if (error) {
        // this doesn't really get used as postgres doesn't return an error when
        // there's no matching row, it just just doesn't do anything.
        console.error(error.stack);
        response.status(404).json({
          status: 404,
          message: error.message
        });
      }
      response.status(201).send(`Permit deleted with ID: ${result.insertId}`)
    })
}

module.exports.extendApp = function ({ app, ssr }) {
  /*
     Extend the parts of the express app that you
     want to use with development server too.

     Example: app.use(), app.get() etc
  */

  app.use(express.json());
  app.get('/api/permitsview', getPermitsView)
  app.get('/api/grouping', getGrouping)
  app.get('/api/orgNames', getOrgNames)
  app.post('/api/permits', addPermit)
  app.put('/api/permits', updatePermit)
  app.delete('/api/permits', deletePermit)
}