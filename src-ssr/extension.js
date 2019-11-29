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

const pool = new Pool({
  user: 'research_catch',
  host: 'nwcdbp24.nwfsc.noaa.gov',
  database: 'framdev',
  password: 'redacted',
  port: 5432
})

const getPermitsView = (request, response) => {
  pool.query('SELECT * FROM research_catch."PERMITS_APP_VIEW"', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getGrouping = (request, response) => {
  pool.query('SELECT * FROM research_catch."GROUPING"', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getOrgID = (request, response) => {
  const orgName = request.params.orgname

  console.log(orgName)

  pool.query('SELECT organization_id FROM "ORGANIZATION_LU" WHERE name =$1', [orgName], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const addPermit = (request, response) => {
  const { srpNumber, organizationId, surveyName, permitYear, startDate, endDate,
    mortalityCreditsApplicable, pointOfContact, dataStatus, deliveryDate, issuedBy,
    principleInvestigator, notes } = request.body

  pool.query('INSERT INTO "RESEARCH_PROJECT" VALUES (INSERT INTO "RESEARCH_PROJECT" VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14))',
    [srpNumber, organizationId, surveyName, permitYear, startDate, endDate,
      mortalityCreditsApplicable, pointOfContact, dataStatus, deliveryDate, issuedBy,
      principleInvestigator, notes], (error, result) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Permit added with ID: ${result.insertId}`)
    })
}

  // const updatePermit = (request, response) => {
  //   const { srpNum, updateFields } = request.body

  //   // Could do some error catching here for an empty updateFields
  //   sqlString = 'UPDATE "RESEARCH_PROJECT" SET survey_name = \'regular size crabs\'
  //   WHERE srp_number = \'SRP-04-2011\''
  // }

const deletePermit = (request, response) => {
  const srpnum = request.params.srpnum

  console.log(srpnum)

  pool.query('DELETE FROM "RESEARCH_PROJECT" WHERE srp_number = $1',
    [srpnum], (error, result) => {
      if (error) {
        throw error
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
  app.get('/api/permitsview', getPermitsView)
  app.get('/api/grouping', getGrouping)
  app.get('/api/getOrgId/:orgname', getOrgID)
  app.post('/api/permits', addPermit)
  app.get('/api/delpermits/:srpnum', deletePermit)
}