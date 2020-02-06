export function updateSPermit (state, newVal) {
  state.permit = newVal;
}

export function updateNew (state, newVal) {
  state.new = newVal;
}

export function updateProjectId (state, newVal) {
  state.permit['research_project_id'] = newVal;
}

export function updatePermitNum (state, newVal) {
  state.permit['permit_number'] = newVal;
}

export function updateOrg (state, newVal) {
  state.permit['organization_name'] = newVal;
}

export function updateProjectName (state, newVal) {
  state.permit['project_name'] = newVal;
}

export function updatePermitYear (state, newVal) {
  state.permit['permit_year'] = newVal;
}

export function updateStartDate (state, newVal) {
  state.permit['start_date'] = newVal;
}

export function updateEndDate (state, newVal) {
  state.permit['end_date'] = newVal;
}

export function updateMortality (state, newVal) {
  state.permit['mortality_credits_applicable'] = newVal;
}

export function updatePOC (state, newVal) {
  state.permit['point_of_contact'] = newVal;
}

export function updateDataStatus (state, newVal) {
  state.permit['data_status'] = newVal;
}

export function updateDeliveryDate (state, newVal) {
  state.permit['delivery_date'] = newVal;
}

export function updateIssuedBy (state, newVal) {
  state.permit['issued_by'] = newVal;
}

export function updatePI (state, newVal) {
  state.permit['principle_investigator'] = newVal;
}

export function updateNotes (state, newVal) {
  state.permit.notes = newVal;
}

export function updateStaffNotes (state, newVal) {
  state.permit['staff_notes'] = newVal;
}

export function clearSPermit (state) {
  state.permit =  {
    'permit_number': null,
    'organization_name': '',
    'project_name': '',
    'permit_year': null,
    'start_date': '',
    'end_date': '',
    'mortality_credits_applicable': false,
    'point_of_contact': '',
    'data_status': 0,
    'delivery_date': '',
    'issued_by': '',
    'principle_investigator': '',
    'notes': '',
    'staff_notes': '' 
  }
}
