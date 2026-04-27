import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  AnalysisResult,
  BreakdownItem,
  RuleStatus,
  Verdict,
} from "../types/analysis";

// ─── Type helpers ─────────────────────────────────────────────────────────────

function toRuleStatus(s: string): RuleStatus {
  if (s === "danger") return "danger";
  if (s === "warning") return "warning";
  return "safe";
}

function toVerdict(v: string): Verdict {
  if (v === "phishing") return "phishing";
  if (v === "suspicious") return "suspicious";
  return "safe";
}

// ─── Exported helpers for manual calls ───────────────────────────────────────

export interface BackendBreakdownItem {
  rule: string;
  status: string;
  description: string;
  detail: string;
}

export interface BackendScanResult {
  riskScore: bigint;
  verdict: string;
  breakdown: BackendBreakdownItem[];
}

export function mapScanResult(
  url: string,
  res: BackendScanResult,
): AnalysisResult {
  const breakdown: BreakdownItem[] = res.breakdown.map((item, i) => ({
    id: `rule_${i}`,
    label: item.rule,
    status: toRuleStatus(item.status),
    // weight per status matching backend logic: danger=30, warning=15
    score: item.status === "danger" ? 30 : item.status === "warning" ? 15 : 0,
    explanation: item.detail || item.description,
  }));

  const riskScore = Number(res.riskScore);
  const verdict = toVerdict(res.verdict);
  const triggeredCount = breakdown.filter((b) => b.status !== "safe").length;
  const confidencePct = Math.round(
    60 + (triggeredCount / Math.max(breakdown.length, 1)) * 40,
  );

  return {
    url,
    verdict,
    riskScore,
    confidencePct,
    breakdown,
    analyzedAt: new Date(),
  };
}

// ─── Threat feed hook ─────────────────────────────────────────────────────────

export interface ThreatFeedEntry {
  url: string;
  verdict: string;
  riskScore: number;
  timestamp: number;
}

export function useThreatFeed() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ThreatFeedEntry[]>({
    queryKey: ["threatFeed"],
    queryFn: async () => {
      if (!actor) return [];
      const records = await actor.getThreatFeed();
      return records.map((r) => ({
        url: r.url,
        verdict: r.verdict,
        riskScore: Number(r.riskScore),
        timestamp: Number(r.timestamp),
      }));
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}
