export interface RootState {
  version: string;
}

export interface PermitState {
  researchProjectId: number | undefined, 
  permitNumber: string, 
  organizationId: number,
  projectName: string, 
  permitYear: number, 
  startDate: string,
  endDate: string, 
  mortalityCreditsApplicable: boolean,
  pointOfContact: string,
  dataStatus: number, 
  deliveryDate: string, 
  issuedBy: string,
  principleInvestigator: string,
  notes: string,
  staffNotes: string
}