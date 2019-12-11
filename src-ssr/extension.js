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
    }
    response.status(200).json(results.rows)
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
    }
    response.status(200).json(results.rows)
  })
}

const getOrgID = async (request, response) => {
  const orgName = request.params.orgname
  pool.query('SELECT organization_id FROM "ORGANIZATION_LU" WHERE name =$1', [orgName], (error, results) => {
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

const getMaxResearchId = async (request, response) => {
  pool.query('SELECT max(research_project_id) FROM "RESEARCH_PROJECT"', (error, results) => {
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

// Taking dates out, but ultimately need to put that back in
const addPermit = async (request, response) => {
  const result = {
    researchProjectId: request.body.researchProjectId,
    permitNumber: request.body.permitNumber,
    organizationId: request.body.organizationId,
    projectName: request.body.projectName,
    permitYear: request.body.permitYear,
    startDate: request.body.startDate,
    endDate: request.body.endDate,
    mortalityCreditsApplicable: request.body.mortalityCreditsApplicable,
    pointOfContact: request.body.pointOfContact,
    dataStatus: request.body.dataStatus,
    deliveryDate: request.body.deliveryDate,
    issuedBy: request.body.issuedBy,
    principleInvestigator: request.body.principleInvestigator,
    notes: request.body.notes
  }

  pool.query('INSERT INTO "RESEARCH_PROJECT" VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)',
    [result.researchProjectId, result.permitNumber, result.organizationId,
      result.projectName, result.permitYear, result.startDate,
      result.endDate, result.mortalityCreditsApplicable, result.pointOfContact,
      result.dataStatus, result.deliveryDate, result.issuedBy,
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

// const updatePermit = (request, response) => {
//   const { permitNum, updateFields } = request.body

//   // Could do some error catching here for an empty updateFields
//   sqlString = 'UPDATE "RESEARCH_PROJECT" SET project_name = \'regular size crabs\'
//   WHERE permit_number = \'permit-04-2011\''
// }

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
  app.get('/api/getOrgId/:orgname', getOrgID)
  app.get('/api/orgNames', getOrgNames)
  app.get('/api/maxResearchId', getMaxResearchId)
  app.post('/api/permits', addPermit)
  app.delete('/api/permits', deletePermit)
}