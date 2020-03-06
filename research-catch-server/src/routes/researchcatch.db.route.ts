//const Pool = require('pg').Pool;

import { Pool } from 'pg';
import { Request, Response } from 'express';

const dbConfig = require('./dbconfig').dbConfig;

const pool = new Pool(dbConfig)

// Get the maximum used catch id
async function getMaxCatchId() {
  let output = null;
  try {
    output = await pool.query('SELECT max(catch_id) FROM "CATCH"')
    return output.rows[0];
  } catch (err) {
    console.log(err.stack);
  }
}

// Get the maximum used research id value
async function getMaxResearchId() {
  let output = null;
  try {
    output = await pool.query('SELECT max(research_project_id) FROM "RESEARCH_PROJECT"');
    return output.rows[0];
  } catch (err) {
    console.log(err.stack);
  }
}

// Get the maximum used organization id
async function getMaxOrgId() {
  let output = null;
  try {
    output = await pool.query('SELECT max(organization_id) FROM "ORGANIZATION_LU"')
    return output.rows[0];
  } catch (err) {
    console.log(err.stack);
  }
}

// Get the data_status_id from the data status look up
async function getStatusId(status: string) {
  let output = null;
  try {
    output = await pool.query('SELECT data_status_id FROM "DATA_STATUS_LU" WHERE status_string =$1', 
      [status]);
    return output.rows[0];
  } catch (err) {
    console.log(err.stack);
  }
}

// Get the depth_bin_id from the data status look up
async function getDepthBinId(depth: string, groupingSpeciesId: number) {
  let output = null;
  let minDepth;
  let maxDepth;
  if (depth.includes('>100')) {
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
    return output.rows[0];
  } catch (err) {
    console.log(err.stack);
  }
}

// Get a grouping_species ID value for a given grouping/species/year combo
async function getGroupSpecID(grouping: string, species: string, year: Number) {
  let output = null;
  try {
    output = await pool.query(`SELECT grouping_species_id FROM "GROUPING_SPECIES_VIEW" 
      WHERE  grouping_name=$1 AND common_name=$2 AND year=$3`,
      [grouping, species, year]);
    return output.rows[0];
  } catch (err) {
    console.log(err.stack);
  }
}

// Add a new org to the org lookup table
async function addOrg(orgId: number, orgName: string) {
  try {
    await pool.query('INSERT INTO "ORGANIZATION_LU" VALUES ($1, $2)',
      [orgId, orgName])
  } catch (err) {
    console.log(err.stack);
  }
}

// Get an org id value for a given org name
async function getOrgId(orgName: string) {
  let output = null;
  try {
    output = await pool.query('SELECT organization_id FROM "ORGANIZATION_LU" WHERE name =$1', 
      [orgName]);
    return output.rows[0];
  } catch (err) {
    console.log(err.stack);
  }
}

// Get a user id value for a given email
async function getUserId(email: string) {
  let output = null;
  try {
    output = await pool.query('SELECT user_id FROM "USER" WHERE email_address =$1', 
      [email]);
    return output.rows[0];
  } catch (err) {
    console.log(err.stack);
  } 
}

export async function getPermitsView(request: Request, response: Response) {
  try {
    let results = await pool.query('SELECT * FROM research_catch."PERMITS_APP_VIEW"');
    response.status(200).json(results.rows);
  } catch (err) {
    console.error(err.stack);
    response.status(400).json({
      status: 400,
      message: 'Could not retrieve permits from database: ' + err.stack
    });
  }
}

export async function getGroupingList(request: Request, response: Response) {
  try {
    let results = await pool.query('SELECT grouping_name FROM research_catch."GROUPING"');
    response.status(200).json(results.rows);
  } catch (err) {
    console.error(err.stack);
    response.status(400).json({
      status: 400,
      message: 'Could not retrieve groupings from database: ' + err.stack
    });
  }
}

export async function getSpeciesList(request: Request, response: Response) {
  try {
    let results = await pool.query('SELECT common_name FROM research_catch."SPECIES_LU"');
    response.status(200).json(results.rows);
  } catch (err) {
    console.error(err.stack);
    response.status(400).json({
      status: 400,
      message: 'Could not retrieve species from database: ' + err.stack
    });
  }
}

// Need to fetch grouping species combos
export async function getSpeciesGrouping(request: Request, response: Response) {
  try {
    let results = await pool.query('SELECT grouping_name, common_name FROM "GROUPING_SPECIES_VIEW";');
    response.status(200).json(results.rows);
  } catch (err) {
    console.error(err.stack);
    response.status(400).json({
      status: 400,
      message: 'Could not retrieve groupings/species from database: ' + err.stack
    });
  }
}

// Get the list of groupings and species that have depth bins
export async function getDepthGroupings(request: Request, response: Response) {
  try {
    let results = await pool.query('SELECT grouping_name, common_name FROM "DEPTH_BIN_GROUPINGS_VIEW";');
    response.status(200).json(results.rows);
  } catch(err) {
    console.error(err.stack);
    response.status(400).json({
      status: 400,
      message: 'Could not retrieve grouping species with depth bins from database: ' + err.stack
    });
  }
}

// Get the list of org names in the ORGANIZATION_LU table
export async function getOrgNames(request: Request, response: Response) {
  try {
    let results = await pool.query('SELECT name FROM "ORGANIZATION_LU"');
    response.status(200).json(results.rows);
  } catch(err) {
    console.error(err.stack);
    response.status(400).json({
      status: 400,
      message: 'Could not retrieve org names from database: ' + err.stack
    });
  }
}

// Get permit id value for a given permit name
export async function getPermitId(request: Request, response: Response) {
  try {
    let results = await pool.query('SELECT research_project_id FROM "RESEARCH_PROJECT" WHERE permit_number = $1',
    [request.params.pnum]);
    response.status(200).json(results.rows)
  } catch (err) {
    console.error(err.stack);
    response.status(400).json({
      status: 400,
      message: 'Could not retrieve permit_id from database: ' + err.stack
    });
  }
}

// Get catch data for a given permit
export async function getCatchData(request: Request, response: Response) {
  try {
    let results = await pool.query('SELECT * FROM "CATCH_VIEW" WHERE research_project_id = $1',
    [request.params.pid]);
    response.status(200).json(results.rows);
  } catch (err) {
    console.error(err.stack);
    response.status(400).json({
      status: 400,
      message: 'Could not retrieve catch data from database: ' + err.stack
    });    
  }
}

/* 
Update any permit entry. This function is picky about what the input 
parameters are named and translates regular meaninful field values to 
their id values in the DB tables when needed. 
 */
export async function updatePermit(request: Request, response: Response) {
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
        orgReturn = await getOrgId(String(kset[1]));
        sqlString = sqlString.concat('organization_id=', orgReturn['organization_id'], ',');
      } catch (err) {
        console.error(err.stack);
        response.status(400).json({
          status: 400,
          message: 'Could not find organization_id: ' + err.stack
        })
        return;
      }
    }
    else if (kset[0] === 'email_address') {
      try {
        userReturn = await getUserId(String(kset[1]));
        sqlString = sqlString.concat('point_of_contact=', userReturn['user_id'], ',');
      } catch (err) {
        response.status(400).json({
          status: 400,
          message: 'Could not find find user_id in database: ' + err.stack
        })
        return;
      }
    }
    else if (kset[0] === 'data_status') {
      try {
        statusReturn = await getStatusId(String(kset[1]));
        sqlString = sqlString.concat('data_status_id=', statusReturn['data_status_id'], ',');
      } catch (err) {
        response.status(400).json({
          status: 400,
          message: 'Could not find find status_id in database: ' + err.stack
        })
        return;
      }
    }
    // handle normal fields
    else if (['permit_year', 'mortality_credits_applicable'].includes(kset[0])) {
      sqlString = sqlString.concat(kset[0], '=', String(kset[1]), ',')
    }
    else if (['notes', 'staff_notes', 'principle_investigator', 'issued_by', 'project_name'].includes(kset[0])) {
      sqlString = sqlString.concat(kset[0], '=\'', String(kset[1]).replace(/\'/g, '\'\''), '\',')
    }
    else {
      sqlString = sqlString.concat(kset[0], '=\'', String(kset[1]), '\',')
    }
  }

  sqlString = sqlString.slice(0, -1)
  sqlString = sqlString.concat(' WHERE research_project_id = \'', request.body.research_project_id, '\'')

  // Final query to update the row in the DB
  try {
    let qresult = await pool.query(sqlString);
    response.status(200).send(`Permit row updated: ${qresult.rows[0]}`);
  } catch (err) {
    console.error(err.stack);
    response.status(401).json({
      status: 401,
      message: 'Could not update permit entry: ' + err.stack
    });
  }
}

/*
This function can be used to add a new permit entry to
the RESEARCH_PROJECT table. Does not require all fields
to have values in the API call, it will automatically
asign nulls to missing fields.
*/
export async function addCatchData(request: Request, response: Response) {
  let result = {
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
    response.status(400).json({
      status: 400,
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
      response.status(400).json({
        status: 400,
        message: 'Could not find matching grouping_species_id in database: ' + err.stack
      })
      return;
    }
    addString = addString.concat(String(groupSpecId), ', ');

    // Total Catch
    if (catchRow.totalCatch) {
      addString = addString.concat(catchRow.totalCatch, ', ');
    } else {
      addString = addString.concat('0, ');
    }

    // Depth Captured
    if (catchRow.depthCaptured && !catchRow.depthCaptured.includes('NA')) {
      let depthBinId = null;
      try {
        let depthBinReturn = await getDepthBinId(String(catchRow.depthCaptured), groupSpecId);
        depthBinId = Number(depthBinReturn['depth_bin_id']);
      } catch (err) {
        response.status(400).json({
          status: 400,
          message: 'Could not find matching depth_bin_id in database for value ' + catchRow.depthCaptured + ': ' + err.stack
        })
        return;
      }
      addString = addString.concat(String(depthBinId), ', ');
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

  try {
    const qresult = await pool.query(sqlString);
    // this isn't returning anything, not sure why since this example is in the docs...
    response.status(200).send(`Catch data added: ${qresult.rows[0]}`);
    } catch (err) {
      console.error(err.stack);
      response.status(400).json({
        status: 400,
        message: 'Could not add catch data to database: ' + err.stack
      });
    }
}

// If catch data is resubmitted, old catch data for that permit
// will be deleted
export async function deleteCatchData(request: Request, response: Response) {
  try {
    const result = await pool.query('DELETE FROM "CATCH" WHERE research_project_id = $1',
      [request.params.pid]) 
    response.status(200).send(`Catch data deleted with ID: ${request.body.pid}`)
  } catch (err) {
      // this doesn't really get used as postgres doesn't return an error when
      // there's no matching row, it just just doesn't do anything.
      console.error(err.stack);
      response.status(400).json({
        status: 400,
        message: 'Could not delete catch data: ' + err.stack
      });
    }
}

/*
This function can be used to add a new permit entry to
the RESEARCH_PROJECT table. Does not require all fields
to have values in the API call, it will automatically
asign nulls to missing fields. Translates regular 
meaningful field values to their id values when appropriate
*/
export async function addPermit(request: Request, response: Response) {
  let result = {
    permitNumber: request.body.permit_number,
    organizationName: request.body.organization_name,
    organizationId: 99999999,
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
    response.status(400).json({
      status: 400,
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
      response.status(400).json({
        status: 400,
        message: 'Could not find max organization_id in database: ' + err.stack
      })
      return;
    }
    result.organizationId = Number(maxOrgReturn['max']) + 1;
    try {
      await addOrg(result.organizationId, result.newOrg)
    } catch (err) {
      response.status(400).json({
        status: 400,
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
      response.status(400).json({
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
      response.status(400).json({
        status: 400,
        message: 'Could not find user_id in database: ' + err.stack
      })
      return;
    }
  }

  try{
    const qresult = await pool.query('INSERT INTO "RESEARCH_PROJECT" (research_project_id, '
      + 'permit_number, organization_id, project_name, permit_year, start_date, ' 
      + 'end_date, mortality_credits_applicable, point_of_contact, data_status_id, '
      + 'issued_by, principle_investigator, notes, staff_notes) '
      + 'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)',
      [researchProjectId, result.permitNumber, result.organizationId, result.projectName,
        result.permitYear, result.startDate, result.endDate, result.mortalityCreditsApplicable,
        result.pointOfContact, result.dataStatus, result.issuedBy, result.principleInvestigator,
        result.notes, result.staffNotes]) 
        response.status(200).send(`Permit row added ${qresult.rows[0]}`)
      } catch (err) {
          response.status(400).json({
            status: 400,
            message: 'Could not add new permit to database: ' + err.stack
          });
        }
}

export async function deletePermit(request: Request, response: Response) {
  try {
    const result = await pool.query('DELETE FROM "RESEARCH_PROJECT" WHERE permit_number = $1',
      [request.params.permitnum]) 
    response.status(200).send(`Permit deleted with ID: ${request.body.insertId}`)
  } catch (err) {
    // this doesn't really get used as postgres doesn't return an error when
    // there's no matching row, it just just doesn't do anything.
    response.status(400).json({
      status: 400,
      message: 'Could not delete permit' + err.message
    })
  }
}
