export interface RootState {
  version: string;
}

export interface SelectedPermit { 
  'permit_number': string,
  'organization_name': string,
  'project_name': string,
  'permit_year': number,
  'start_date': string,
  'end_date': string,
  'mortality_credits_applicable': boolean,
  'point_of_contact': string,
  'data_status': number,
  'delivery_date': string,
  'issued_by': string,
  'principle_investigator': string,
  'notes': string,
  'staff_notes': string
}