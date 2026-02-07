
export enum FunnelStep {
  SIGNUP = 'Signup',
  KYC = 'KYC Verification',
  PAYMENT_SELECTION = 'Payment Selection',
  DEPOSIT = 'Deposit',
  TRADE = 'First Trade'
}

export enum Region {
  LATAM = 'LATAM',
  EU = 'EU',
  SE_ASIA = 'SE Asia'
}

export enum Device {
  MOBILE = 'Mobile',
  DESKTOP = 'Desktop'
}

export interface FunnelMetrics {
  step: FunnelStep;
  region: Region;
  device: Device;
  currentConv: number;
  baselineConv: number;
  rageClicks: number;
  hesitationTimeSeconds: number;
  repeatedAttempts: number;
}

export interface ComparativeAnalysis {
  pre: FunnelMetrics;
  post: FunnelMetrics;
  lift: number;
  rageReduction: number;
}

export interface IssueCard {
  issue: string;
  segment: string;
  severity: 'Low' | 'Medium' | 'High';
  root_causes: string[];
  confidence: number;
  recommended_fixes: string[];
  expected_impact: string;
  priority: string;
  suggested_owner: string;
}

export interface AnalysisResponse {
  detection: string;
  diagnosis: string;
  prioritization: string;
  recommendations: string;
  issue_card: IssueCard;
}

export interface MeasurementResult {
  beforeConv: number;
  afterConv: number;
  improvement: number;
  status: 'Keep' | 'Iterate' | 'Rollback';
  summary: string;
}
