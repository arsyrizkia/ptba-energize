export type ProjectStatus = "On Progress" | "Planning" | "Completed" | "On Hold";

export interface TimelineActivity {
  id: string;
  activity: string;
  startDate: string;
  endDate: string;
  stageActivity: string;
  stage: string;
  estimatePeriod: string;
}

export interface FinancialData {
  financialNote: string;
  npv: number;
  irr: number;
  paybackPeriod: string;
  waccCalculation: number;
  capitalExpenditure: number;
  tariff: string;
  mainCriteriaIndication: string;
}

export interface RiskItem {
  id: string;
  riskScore: number;
  type: string;
  riskArea: string;
  controlStatus: string;
  levelScore: number;
  impactScore: number;
  riskStatus: string;
  riskTreatment: string;
}

export interface LegalAspect {
  legalAspect1: string;
  notariat: string;
  material: string;
  lingkungan: string;
  keamanan: string;
  perizinan: string;
  labor: string;
  keselamatan: string;
  regulasi: string;
  asuransi: string;
}

export interface ActionPlanItem {
  id: string;
  kegiatan: string;
  issues: string;
  sample: string;
  actionPlan: string;
  targetWaktu: string;
}

export interface ProgressMonitoring {
  progressReport: string;
  report: string;
}

export interface TechnicalStudy {
  projectCertification: string;
  technicalReport: string;
  demandAnalysis: string;
  terminalSpin: string;
}

export interface Submission {
  ptbaDescription: string;
  ptbaGoals: string;
  ebdInitiatives: string;
  strategic: string;
}

export interface ExternalData {
  technicalStudy: TechnicalStudy;
  submission: Submission;
}

export interface ProjectOverview {
  projectName: string;
  description: string;
  capacity: string;
  location: string;
  projectImage: string;
  keyAdvantage: string;
  plnConnection: string;
  competitiveAdvantage: string;
  background: string;
}

export interface EnergyProject {
  id: string;
  overview: ProjectOverview;
  status: ProjectStatus;
  timeline: TimelineActivity[];
  financial: FinancialData;
  risks: RiskItem[];
  legal: LegalAspect;
  actionPlan: ActionPlanItem[];
  progressMonitoring: ProgressMonitoring;
  externalData: ExternalData;
  documents: ProjectDocument[];
}

export type DocumentCategory =
  | "Risk Money"
  | "Pitch Deck"
  | "Business Pitch Deck"
  | "RMM"
  | "BOL"
  | "External Data";

export interface ProjectDocument {
  id: string;
  projectId: string;
  projectName: string;
  category: DocumentCategory;
  title: string;
  description: string;
  fileType: string;
  fileSize: string;
  updatedAt: string;
}
