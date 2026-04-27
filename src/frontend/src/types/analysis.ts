export type Verdict = "safe" | "suspicious" | "phishing";
export type RuleStatus = "safe" | "warning" | "danger";

export interface BreakdownItem {
  id: string;
  label: string;
  status: RuleStatus;
  score: number;
  explanation: string;
}

export interface AnalysisResult {
  url: string;
  verdict: Verdict;
  riskScore: number;
  confidencePct: number;
  breakdown: BreakdownItem[];
  analyzedAt: Date;
}
