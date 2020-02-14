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

// Get the maximum used research id value
async function getMaxResearchId() {
  let output = null;
  try {
    output = await pool.query('SELECT max(research_project_id) FROM "RESEARCH_PROJECT"');
  } catch (err) {
    console.log(err.stack);
  }

  return output.rows[0];
}

// Get the maximum used catch id
async function getMaxCatchId() {
  let output = null;
  try {
    output = await pool.query('SELECT max(catch_id) FROM "CATCH"')
  } catch (err) {
    console.log(err.stack);
  }

  return output.rows[0];
}

// Get a grouping_species ID value for a given grouping/species/year combo
async function getGroupSpecID(grouping, species, year) {
  let output = null;
  try {
    output = await pool.query(`SELECT grouping_species_id FROM "GROUPING_SPECIES_VIEW" 
      WHERE  grouping_name=$1 AND common_name=$2 AND year=$3`,
      [grouping, species, year]);
  } catch (err) {
    console.log(err.stack);
  }

  return output.rows[0];
}

// Get the maximum used organization id
async function getMaxOrgId() {
  let output = null;
  try {
    output = await pool.query('SELECT max(organization_id) FROM "ORGANIZATION_LU"')
  } catch (err) {
    console.log(err.stack);
  }

  return output.rows[0];
}

// Get an org id value for a given org name
async function getOrgId(orgName) {
  let output = null;
  try {
    output = await pool.query('SELECT organization_id FROM "ORGANIZATION_LU" WHERE name =$1', 
      [orgName]);
  } catch (err) {
    console.log(err.stack);
  }

  return output.rows[0];
}

// Add a new org to the org lookup table
async function addOrg(orgId, orgName) {
  try {
    await pool.query('INSERT INTO "ORGANIZATION_LU" VALUES ($1, $2)',
      [orgId, orgName])
  } catch (err) {
    console.log(err.stack);
  }
}

// Get a user id value for a given email
async function getUserId(email) {
  let output = null;
  try {
    output = await pool.query('SELECT user_id FROM "USER" WHERE email_address =$1', 
      [email]);
  } catch (err) {
    console.log(err.stack);
  }

  return output.rows[0];
}

// Get the data_status_id from the data status look up
async function getStatusId(status) {
  let output = null;
  try {
    output = await pool.query('SELECT data_status_id FROM "DATA_STATUS_LU" WHERE status_string =$1', 
      [status]);
  } catch (err) {
    console.log(err.stack);
  }

  return output.rows[0];
}

// Get the depth_bin_id from the data status look up
async function getDepthBinId(depth, groupingSpeciesId) {
  let output = null;
  let minDepth;
  let maxDepth;
  if (depth === '>100') {
    minDepth = 100;
    maxDepth = 999999;
  } else {
    minDepth = depth.split('-')[0];
    maxDepth = depth.split('-')[1];
  }

  try {
    output = await pool.query(`SELECT depth_bin_id FROM "DEPTH_BIN" WHERE 
    min_depth_ftm = $1 AND max_depth_ftm = $2 AND grouping_species_id= $3`, 
    [minDepth, maxDepth, groupingSpeciesId]);
  } catch (err) {
    console.log(err.stack);
  }

  return output.rows[0];
}

const getPermitsView = async (request, response) => {
  pool.query('SELECT * FROM research_catch."PERMITS_APP_VIEW"', (error, results) => {
    if (error) {
      console.error(error.stack);
      response.status(401).json({
        status: 401,
        message: 'Could not retrieve permits from database: ' + error.stack
      });
    } else {
      response.status(200).json(results.rows)
    }
  })
}

const getGroupingList = async (request, response) => {
  pool.query('SELECT grouping_name FROM research_catch."GROUPING"', (error, results) => {
    if (error) {
      console.error(error.stack);
      response.status(401).json({
        status: 401,
        message: 'Could not retrieve groupings from database: ' + error.stack
      });
    } else {
      response.status(200).json(results.rows)
    }
  })
}

const getSpeciesList = async (request, response) => {
  pool.query('SELECT common_name FROM research_catch."SPECIES_LU"', (error, results) => {
    if (error) {
      console.error(error.stack);
      response.status(401).json({
        status: 401,
        message: 'Could not retrieve species from database: ' + error.stack
      });
    } else {
      response.status(200).json(results.rows)
    }
  })
}

// Need to fetch grouping species combos
const getSpeciesGrouping = async (request, response) => {
  pool.query('SELECT grouping_name, common_name FROM "GROUPING_SPECIES_VIEW";', (error, results) => {
    if (error) {
      console.error(error.stack);
      response.status(401).json({
        status: 401,
        message: 'Could not retrieve groupings/species from database: ' + error.stack
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
        message: 'Could not retrieve org names from database: ' + error.stack
      });
    }
    response.status(200).json(results.rows)
  })
}

// Get permit id value for a given permit name
const getPermitId = async (request, response) => {
  pool.query('SELECT research_project_id FROM "RESEARCH_PROJECT" WHERE permit_number = $1',
    [request.body.permit_number], (error, results) => {
      if (error) {
        console.error(error.stack);
        response.status(401).json({
          status: 401,
          message: 'Could not retrieve permit_id from database: ' + error.stack
        });
      } else {
        response.status(200).json(results.rows)
      }
    })
}

// Get catch data for a given permit
const getCatchData = async (request, response) => {
  pool.query('SELECT * FROM "CATCH_VIEW" WHERE research_project_id = $1',
    [request.body.research_project_id], (error, results) => {
      if (error) {
        console.error(error.stack);
        response.status(401).json({
          status: 401,
          message: 'Could not retrieve catch data from database: ' + error.stack
        });
      } else {
        response.status(200).json(results.rows)
      }
    })
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
  // TODO: refactor this so it's putting together the query using
  // the actual variables plugged into the query call
  for (const kset of entries) {
    if (kset[1] === null) {
      continue;
    }
    if (kset[0] === 'organization_name') {
      try {
        orgReturn = await getOrgId(kset[1]);
        sqlString = sqlString.concat('organization_id=', orgReturn['organization_id'], ',');
      } catch (err) {
        console.error(err.stack);
        response.status(401).json({
          status: 401,
          message: 'Could not find organization_id: ' + err.stack
        })
        return;
      }
    }
    else if (kset[0] === 'email_address') {
      try {
        userReturn = await getUserId(kset[1]);
        sqlString = sqlString.concat('point_of_contact=', userReturn['user_id'], ',');
      } catch (err) {
        response.status(401).json({
          status: 401,
          message: 'Could not find find user_id in database: ' + err.stack
        })
        return;
      }
    }
    else if (kset[0] === 'data_status') {
      try {
        statusReturn = await getStatusId(kset[1]);
        sqlString = sqlString.concat('data_status_id=', statusReturn['data_status_id'], ',');
      } catch (err) {
        response.status(401).json({
          status: 401,
          message: 'Could not find find status_id in database: ' + err.stack
        })
        return;
      }
    }
    // handle normal fields
    else if (['permit_year', 'mortality_credits_applicable'].includes(kset[0])) {
      sqlString = sqlString.concat(kset[0], '=', kset[1], ',')
    }
    else if (['notes', 'staff_notes', 'principle_investigator', 'issued_by', 'project_name'].includes(kset[0])) {
      sqlString = sqlString.concat(kset[0], '=\'', kset[1].replace(/\'/g, '\'\''), '\',')
    }
    else {
      sqlString = sqlString.concat(kset[0], '=\'', kset[1], '\',')
    }
  }

  sqlString = sqlString.slice(0, -1)
  sqlString = sqlString.concat(' WHERE research_project_id = \'', request.body.research_project_id, '\'')

  // Final query to update the row in the DB
  pool.query(sqlString, [], (error, result) => {
    if (error) {
      console.error(error.stack);
      response.status(401).json({
        status: 401,
        message: 'Could not update permit entry: ' + error.stack
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
asign nulls to missing fields.
*/
const addCatchData = async (request, response) => {
  const result = {
    researchProjectId: request.body.research_project_id,
    catchData: request.body.catch_data,
    year: request.body.year
  }

  let sqlString = `INSERT INTO "CATCH" (catch_id, grouping_species_id, 
    total_catch_mt, depth_bin_id, percent_released_at_depth, notes, 
    research_project_id) VALUES `

  // Get a new unused number for the catch_id value
  let catchId = 9999;
  try {
    let maxReturn = await getMaxCatchId();
    catchId = Number(maxReturn['max']) + 1;
  } catch (err) {
    response.status(401).json({
      status: 401,
      message: 'Could not find max catch_id in database: ' + err.stack
    })
    return;
  }

  for (let catchRow of result.catchData) {
    // Group Species ID
    let addString = '( ' + String(catchId) + ', ';
    let groupSpecId = null;
    try {
      let groupSpecIdReturn = await getGroupSpecID(catchRow.grouping, catchRow.species, result.year);
      groupSpecId = Number(groupSpecIdReturn['grouping_species_id']);
    } catch (err) {
      response.status(401).json({
        status: 401,
        message: 'Could not find matching grouping_species_id in database: ' + err.stack
      })
      return;
    }
    addString = addString.concat(groupSpecId, ', ');

    // Total Catch
    if (catchRow.totalCatch) {
      addString = addString.concat(catchRow.totalCatch, ', ');
    } else {
      addString = addString.concat('0, ');
    }

    // Depth Captured
    if (catchRow.depthCaptured) {
      let depthBinId = null;
      try {
        let depthBinReturn = await getDepthBinId(catchRow.depthCaptured, groupSpecId);
        depthBinId = Number(depthBinReturn['depth_bin_id']);
      } catch (err) {
        response.status(401).json({
          status: 401,
          message: 'Could not find matching depth_bin_id in database for value ' + catchRow.depthCaptured + ': ' + err.stack
        })
        return;
      }
      addString = addString.concat(depthBinId, ', ');
    } else {
      addString = addString.concat('null, ');
    }

    // Percent Released at Depth
    if (catchRow.released) {
      addString = addString.concat(catchRow.released, ', ');
    } else {
      addString = addString.concat('null, ');
    }

    // Notes
    if (catchRow.notes) {
      addString = addString.concat('\'', catchRow.notes, '\', ');
    }
    else {
      addString = addString.concat('\'\', ');
    }

    // Research Project ID
    addString = addString.concat(result.researchProjectId, '),');

    // Attach to sql string and bump up ID for next loop
    sqlString = sqlString.concat(addString);
    catchId += 1;
  }

  sqlString = sqlString.slice(0, -1);

  pool.query(sqlString, (error, result) => {
    if (error) {
      console.error(error.stack);
      response.status(401).json({
        status: 401,
        message: 'Could not add catch data to database: ' + error.stack
      });
    }
    // this isn't returning anything, not sure why since this example is in the docs...
    else {
      response.status(201).send(`Catch data added: ${result.rows[0]}`);
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
    permitNumber: request.body.permit_number,
    organizationName: request.body.organization_name,
    newOrg: request.body.new_org,
    projectName: request.body.project_name,
    permitYear: request.body.permit_year,
    startDate: request.body.start_date,
    endDate: request.body.end_date,
    mortalityCreditsApplicable: request.body.mortality_credits_applicable,
    pointOfContact: request.body.point_of_contact,
    email: request.body.email,
    dataStatus: request.body.data_status_id,
    issuedBy: request.body.issued_by,
    principleInvestigator: request.body.principle_investigator,
    notes: request.body.notes,
    staffNotes: request.body.staff_notes
  }
  // Get a new unused number for the research_project_id value
  let maxReturn;
  try {
    maxReturn = await getMaxResearchId();
  } catch (err) {
    response.status(401).json({
      status: 401,
      message: 'Could not find max research_id in database: ' + err.stack
    })
    return;
  }
  let researchProjectId = Number(maxReturn['max']) + 1;

  // Create new organization entry if needed
  if (result.newOrg) {
    let maxOrgReturn;
    try {
      maxOrgReturn = await getMaxOrgId();
    } catch (err) {
      response.status(401).json({
        status: 401,
        message: 'Could not find max organization_id in database: ' + err.stack
      })
      return;
    }
    result.organizationId = Number(maxOrgReturn['max']) + 1;
    try {
      await addOrg(result.organizationId, result.newOrg)
    } catch (err) {
      response.status(401).json({
        status: 401,
        message: 'Could not find add new organization to database: ' + err.stack
      })
      return;
    }
  }

  // Translate values to Ids
  let orgReturn = null;
  let userReturn = null;
  if (result.organizationName) {
    try {
      orgReturn = await getOrgId(result.organizationName);
      result.organizationId = orgReturn['organization_id'];
    } catch (err) {
      response.status(401).json({
        status: 401,
        message: 'Could not find find organization_id in database: ' + err.stack
      })
      return;
    }
  }
  if (result.email) {
    try {
      userReturn = await getUserId(result.email);
      result.pointOfContact = userReturn['user_id'];
    } catch (err) {
      response.status(401).json({
        status: 401,
        message: 'Could not find user_id in database: ' + err.stack
      })
      return;
    }
  }

  pool.query('INSERT INTO "RESEARCH_PROJECT" (research_project_id, permit_number, organization_id, project_name, '
    + 'permit_year, start_date, end_date, mortality_credits_applicable, point_of_contact, data_status_id, '
    + 'issued_by, principle_investigator, notes, staff_notes) '
    + 'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)',
    [researchProjectId, result.permitNumber, result.organizationId, result.projectName,
      result.permitYear, result.startDate, result.endDate, result.mortalityCreditsApplicable,
      result.pointOfContact, result.dataStatus, result.issuedBy, result.principleInvestigator,
      result.notes, result.staffNotes], (error, result) => {
        if (error) {
          response.status(401).json({
            status: 401,
            message: 'Could not add new permit to database: ' + err.stack
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
  app.get('/api/grouping', getGroupingList)
  app.get('/api/species', getSpeciesList)
  app.get('/api/speciesgrouping', getSpeciesGrouping)
  app.get('/api/orgNames', getOrgNames)
  app.post('/api/permitid', getPermitId)
  app.post('/api/permits', addPermit)
  app.put('/api/catch', addCatchData)
  app.post('/api/catch', getCatchData)
  app.put('/api/permits', updatePermit)
  app.delete('/api/permits', deletePermit)
}