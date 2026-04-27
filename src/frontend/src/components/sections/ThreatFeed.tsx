import { AlertCircle, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";
import { useThreatFeed } from "../../hooks/useQueries";

type ThreatLevel = "Phishing" | "Suspicious";

interface ThreatEntry {
  domain: string;
  level: ThreatLevel;
  timeAgo: string;
  flag: string;
  riskScore: number;
}

const DEMO_THREATS: ThreatEntry[] = [
  {
    domain: "paypa1-secure-login.com",
    level: "Phishing",
    timeAgo: "2 mins ago",
    flag: "🇺🇸",
    riskScore: 94,
  },
  {
    domain: "amazon-account-verify.xyz",
    level: "Phishing",
    timeAgo: "5 mins ago",
    flag: "🇺🇸",
    riskScore: 91,
  },
  {
    domain: "apple-id-suspended.tk",
    level: "Phishing",
    timeAgo: "12 mins ago",
    flag: "🇺🇸",
    riskScore: 88,
  },
  {
    domain: "microsoft-security-alert.ml",
    level: "Phishing",
    timeAgo: "18 mins ago",
    flag: "🇺🇸",
    riskScore: 85,
  },
  {
    domain: "bankofamerica-secure.top",
    level: "Phishing",
    timeAgo: "31 mins ago",
    flag: "🇺🇸",
    riskScore: 82,
  },
  {
    domain: "google-account-update.cf",
    level: "Suspicious",
    timeAgo: "45 mins ago",
    flag: "🇺🇸",
    riskScore: 57,
  },
  {
    domain: "netflix-login-verify.xyz",
    level: "Suspicious",
    timeAgo: "1 hr ago",
    flag: "🇺🇸",
    riskScore: 53,
  },
  {
    domain: "instagram-confirm-identity.ga",
    level: "Phishing",
    timeAgo: "2 hrs ago",
    flag: "🇺🇸",
    riskScore: 79,
  },
];

function formatTimeAgo(timestamp: number): string {
  const diffMs = Date.now() - timestamp / 1_000_000; // nanoseconds → ms
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min${diffMin !== 1 ? "s" : ""} ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr${diffHr !== 1 ? "s" : ""} ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0];
  }
}

function backendToThreatEntry(entry: {
  url: string;
  verdict: string;
  riskScore: number;
  timestamp: number;
}): ThreatEntry {
  return {
    domain: extractDomain(entry.url),
    level: entry.verdict === "phishing" ? "Phishing" : "Suspicious",
    timeAgo: formatTimeAgo(entry.timestamp),
    flag: "🌐",
    riskScore: entry.riskScore,
  };
}

function ThreatBadge({ level }: { level: ThreatLevel }) {
  if (level === "Phishing") {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/25"
        data-ocid="threats.badge_phishing"
      >
        <AlertTriangle className="w-2.5 h-2.5" aria-hidden="true" />
        PHISHING
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/25"
      data-ocid="threats.badge_suspicious"
    >
      <AlertCircle className="w-2.5 h-2.5" aria-hidden="true" />
      SUSPICIOUS
    </span>
  );
}

function RiskScorePill({
  score,
  level,
}: { score: number; level: ThreatLevel }) {
  const color =
    level === "Phishing" ? "text-destructive text-glow-red" : "text-yellow-400";
  return (
    <span className={`font-mono font-bold text-sm tabular-nums ${color}`}>
      {score}
      <span className="text-muted-foreground font-normal text-xs">/100</span>
    </span>
  );
}

export function ThreatFeed() {
  const { data: backendThreats, isLoading } = useThreatFeed();

  const threats: ThreatEntry[] =
    backendThreats && backendThreats.length > 0
      ? backendThreats.map(backendToThreatEntry)
      : DEMO_THREATS;

  const isLive = !!(backendThreats && backendThreats.length > 0);

  return (
    <section
      className="relative py-24 px-4 bg-muted/5 border-y border-border overflow-hidden"
      data-ocid="threats.section"
    >
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-40" />
      {/* Red ambient glow — danger zone */}
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-destructive/4 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header row */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10"
        >
          <div>
            <p className="text-xs font-mono text-primary uppercase tracking-widest mb-2">
              Threat Intelligence
            </p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
              Recent Threats Detected
            </h2>
            {/* Cyan accent underline */}
            <div className="mt-3 flex items-center gap-2">
              <div className="h-px w-12 bg-primary/30" />
              <div
                className="h-0.5 w-16 bg-primary rounded-full"
                style={{ boxShadow: "0 0 8px rgba(0,217,255,0.6)" }}
              />
              <div className="h-px w-12 bg-primary/30" />
            </div>
          </div>

          {/* LIVE indicator */}
          <div
            className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-destructive/30 bg-destructive/5"
            data-ocid="threats.live_indicator"
          >
            <span
              className="relative flex h-2.5 w-2.5"
              aria-label={isLive ? "Live feed active" : "Demo data"}
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-70" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive shadow-[0_0_8px_rgba(255,23,68,0.8)]" />
            </span>
            <span className="text-xs font-mono font-bold text-destructive tracking-widest uppercase">
              {isLive ? "LIVE" : "LIVE"}
            </span>
          </div>
        </motion.div>

        {/* Loading skeleton */}
        {isLoading && (
          <div
            className="cyber-border rounded-xl overflow-hidden bg-card/30 p-6 space-y-3"
            data-ocid="threats.loading_state"
          >
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-muted/30 rounded animate-pulse" />
            ))}
          </div>
        )}

        {/* Table container */}
        {!isLoading && (
          <div className="cyber-border rounded-xl overflow-hidden bg-card/30">
            {/* Table head */}
            <div className="hidden sm:grid grid-cols-[1fr_130px_90px_110px_60px] gap-4 px-6 py-3 border-b border-border bg-muted/20 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
              <span>Domain</span>
              <span>Threat Level</span>
              <span>Risk Score</span>
              <span>Detected</span>
              <span>Origin</span>
            </div>

            {/* Rows */}
            {threats.map((threat, idx) => (
              <motion.div
                key={`${threat.domain}-${idx}`}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: idx * 0.07,
                  duration: 0.45,
                  ease: "easeOut",
                }}
                className={`
                  grid grid-cols-1 sm:grid-cols-[1fr_130px_90px_110px_60px] gap-3 sm:gap-4
                  px-6 py-4 border-b border-border/50 last:border-b-0
                  hover:bg-muted/10 transition-smooth items-center
                  ${threat.level === "Phishing" ? "hover:bg-destructive/5" : "hover:bg-yellow-400/5"}
                `}
                data-ocid={`threats.item.${idx + 1}`}
              >
                {/* Domain — monospace */}
                <span
                  className="font-mono text-xs text-foreground/90 truncate min-w-0"
                  title={threat.domain}
                >
                  {threat.domain}
                </span>

                {/* Badge */}
                <div className="flex items-center">
                  <ThreatBadge level={threat.level} />
                </div>

                {/* Risk score */}
                <div>
                  <RiskScorePill
                    score={threat.riskScore}
                    level={threat.level}
                  />
                </div>

                {/* Time */}
                <span className="text-[10px] font-mono text-muted-foreground">
                  {threat.timeAgo}
                </span>

                {/* Flag */}
                <span className="text-base" title="Origin" aria-label="Origin">
                  {threat.flag}
                </span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-4 text-center text-[11px] font-mono text-muted-foreground/50"
          data-ocid="threats.disclaimer"
        >
          {isLive
            ? "⚡ Live threat data from recent scans — updated in real time."
            : "⚠ Demo data shown while awaiting live scan data."}
        </motion.p>
      </div>
    </section>
  );
}
