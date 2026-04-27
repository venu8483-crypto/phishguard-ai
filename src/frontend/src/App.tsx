import { useActor } from "@caffeineai/core-infrastructure";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Eye,
  Globe,
  RefreshCw,
  Search,
  Shield,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createActor } from "./backend";
import { Layout } from "./components/Layout";
import { CTASection } from "./components/sections/CTASection";
import { CapabilitiesSection } from "./components/sections/CapabilitiesSection";
import { HowItWorks } from "./components/sections/HowItWorks";
import { Statistics } from "./components/sections/Statistics";
import { ThreatFeed } from "./components/sections/ThreatFeed";
import { mapScanResult } from "./hooks/useQueries";
import type { AnalysisResult, Verdict } from "./types/analysis";

// ─── Verdict helpers ─────────────────────────────────────────────────────────

function verdictColor(v: Verdict) {
  if (v === "phishing") return "text-destructive text-glow-red";
  if (v === "suspicious") return "text-yellow-400";
  return "text-green-400 text-glow-green";
}
function verdictBorder(v: Verdict) {
  if (v === "phishing") return "cyber-border-danger glow-red";
  if (v === "suspicious") return "border border-yellow-500/30";
  return "cyber-border-success glow-green";
}
function verdictIcon(v: Verdict) {
  if (v === "phishing") return <XCircle className="w-5 h-5 text-destructive" />;
  if (v === "suspicious")
    return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
  return <CheckCircle2 className="w-5 h-5 text-green-400" />;
}
function statusColor(s: string) {
  if (s === "danger") return "text-destructive";
  if (s === "warning") return "text-yellow-400";
  return "text-green-400";
}
function statusBg(s: string) {
  if (s === "danger") return "bg-destructive/10 border border-destructive/30";
  if (s === "warning") return "bg-yellow-400/10 border border-yellow-400/30";
  return "bg-green-400/10 border border-green-400/30";
}
function statusDot(s: string) {
  if (s === "danger")
    return "bg-destructive shadow-[0_0_6px_rgba(255,23,68,0.8)]";
  if (s === "warning") return "bg-yellow-400";
  return "bg-green-400 shadow-[0_0_6px_rgba(0,255,65,0.8)]";
}

// ─── Scanner Section ──────────────────────────────────────────────────────────

const SAMPLE_URLS = [
  "https://paypa1-secure-verify.xyz/login/confirm",
  "https://microsoft-account-update.tk/secure/reset",
  "http://192.168.1.102/bank/login",
  "https://google.com",
  "https://github.com/vercel/next.js",
];

function ScanProgressBar({ stage }: { stage: number }) {
  const stages = [
    "Resolving Domain",
    "Checking Reputation",
    "Analyzing Patterns",
    "Computing Risk Score",
  ];
  return (
    <div className="space-y-3">
      {stages.map((s, i) => (
        <div key={s} className="flex items-center gap-3">
          <div
            className={`w-2 h-2 rounded-full transition-all duration-500 ${i < stage ? statusDot("safe") : i === stage ? "bg-primary animate-pulse" : "bg-muted-foreground/30"}`}
          />
          <span
            className={`text-xs font-mono transition-colors duration-300 ${i < stage ? "text-green-400" : i === stage ? "text-primary" : "text-muted-foreground/40"}`}
          >
            {s}
          </span>
          {i < stage && (
            <CheckCircle2 className="w-3 h-3 text-green-400 ml-auto" />
          )}
          {i === stage && (
            <Activity className="w-3 h-3 text-primary ml-auto animate-spin" />
          )}
        </div>
      ))}
    </div>
  );
}

function RiskGauge({ score }: { score: number }) {
  const rotation = -135 + (score / 100) * 270;
  const color = score >= 70 ? "#ff1744" : score >= 40 ? "#ffd740" : "#00ff41";
  return (
    <div className="relative w-28 h-16 mx-auto">
      <svg
        viewBox="0 0 120 70"
        className="w-full h-full"
        aria-label="Risk gauge meter"
        role="img"
      >
        <path
          d="M 15 65 A 50 50 0 0 1 105 65"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M 15 65 A 50 50 0 0 1 105 65"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="157"
          strokeDashoffset={157 - (score / 100) * 157}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
        <g transform={`rotate(${rotation}, 60, 65)`}>
          <line
            x1="60"
            y1="65"
            x2="60"
            y2="25"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="60" cy="65" r="4" fill="white" />
        </g>
      </svg>
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-center">
        <span className="text-2xl font-display font-bold" style={{ color }}>
          {score}
        </span>
        <span className="text-xs text-muted-foreground font-mono">/100</span>
      </div>
    </div>
  );
}

function ResultPanel({ result }: { result: AnalysisResult }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Verdict Banner */}
      <div
        className={`rounded-lg p-4 ${verdictBorder(result.verdict)}`}
        data-ocid="scanner.verdict_card"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {verdictIcon(result.verdict)}
            <div>
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
                Threat Status
              </p>
              <p
                className={`text-xl font-display font-bold uppercase tracking-wide ${verdictColor(result.verdict)}`}
              >
                {result.verdict === "phishing"
                  ? "Critical Threat"
                  : result.verdict === "suspicious"
                    ? "Suspicious"
                    : "Safe"}
              </p>
            </div>
          </div>
          <RiskGauge score={result.riskScore} />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-muted/30 rounded px-3 py-2">
            <p className="text-muted-foreground">Risk Score</p>
            <p className={`font-bold text-sm ${verdictColor(result.verdict)}`}>
              {result.riskScore}/100
            </p>
          </div>
          <div className="bg-muted/30 rounded px-3 py-2">
            <p className="text-muted-foreground">Confidence</p>
            <p className="font-bold text-sm text-primary">
              {result.confidencePct}%
            </p>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-2" data-ocid="scanner.breakdown_list">
        <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest px-1">
          Analysis Breakdown
        </p>
        {result.breakdown.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`rounded-md px-3 py-2.5 ${statusBg(item.status)}`}
            data-ocid={`scanner.breakdown.item.${i + 1}`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${statusDot(item.status)}`}
                />
                <span className="text-xs font-display font-semibold text-foreground">
                  {item.label}
                </span>
              </div>
              <span
                className={`text-xs font-mono font-bold ${statusColor(item.status)}`}
              >
                {item.score > 0 ? `+${item.score} risk` : "PASS"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground pl-3.5">
              {item.explanation}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function ScannerSection() {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanStage, setScanStage] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { actor } = useActor(createActor);

  async function handleScan() {
    if (!url.trim()) {
      setError("Please enter a URL to scan");
      return;
    }
    setError("");
    setResult(null);
    setScanning(true);
    setScanStage(0);

    // Animate progress stages while waiting for backend
    const stageInterval = setInterval(() => {
      setScanStage((prev) => (prev < 3 ? prev + 1 : prev));
    }, 400);

    try {
      let normalizedUrl = url.trim();
      if (
        !normalizedUrl.startsWith("http://") &&
        !normalizedUrl.startsWith("https://")
      ) {
        normalizedUrl = `https://${normalizedUrl}`;
      }

      if (!actor) {
        throw new Error("Backend not ready");
      }

      const res = await actor.scanUrl(normalizedUrl);
      clearInterval(stageInterval);
      setScanStage(3);
      setResult(mapScanResult(normalizedUrl, res));
    } catch {
      clearInterval(stageInterval);
      setError("Failed to analyze URL. Please try again.");
    } finally {
      setScanning(false);
    }
  }

  function handleReset() {
    setResult(null);
    setUrl("");
    setError("");
    setScanStage(0);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  return (
    <section
      id="scanner"
      className="relative min-h-screen flex flex-col items-center justify-center py-24 px-4 cyber-grid overflow-hidden"
    >
      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-destructive/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        {/* Hero headline */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono text-primary tracking-widest uppercase">
              Live Threat Intelligence
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-bold text-foreground leading-tight mb-4">
            Detect Phishing &{" "}
            <span className="text-primary text-glow-cyan">Malicious URLs</span>
            <br />
            <span className="text-2xl sm:text-4xl text-muted-foreground font-normal">
              in Real-Time
            </span>
          </h1>
          <p className="text-muted-foreground font-body max-w-xl mx-auto text-lg">
            Enterprise-grade heuristic analysis engine. Identify threats before
            they compromise your security.
          </p>
        </motion.div>

        {/* Scanner card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="cyber-border rounded-xl p-6 bg-card/60 backdrop-blur-sm"
          data-ocid="scanner.panel"
        >
          {/* Input row */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                ref={inputRef}
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !scanning && !!actor && handleScan()
                }
                placeholder="https://suspicious-website.com/login"
                disabled={scanning}
                className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-lg text-sm font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 focus:glow-cyan transition-smooth disabled:opacity-50"
                data-ocid="scanner.url_input"
              />
            </div>
            <button
              type="button"
              onClick={result ? handleReset : handleScan}
              disabled={scanning || !actor}
              className="flex items-center gap-2 px-5 py-3 bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary/60 text-primary font-display font-semibold text-sm rounded-lg transition-smooth hover-glow-cyan disabled:opacity-50 disabled:cursor-not-allowed"
              data-ocid="scanner.scan_button"
            >
              {scanning ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : result ? (
                <RefreshCw className="w-4 h-4" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              {scanning ? "Scanning…" : result ? "Rescan" : "Analyze"}
            </button>
          </div>

          {/* Sample URLs */}
          {!result && !scanning && (
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs text-muted-foreground font-mono">
                Try:
              </span>
              {SAMPLE_URLS.slice(0, 3).map((s, i) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setUrl(s)}
                  className="text-xs font-mono text-primary/70 hover:text-primary px-2 py-0.5 rounded bg-primary/5 hover:bg-primary/10 border border-primary/10 transition-smooth truncate max-w-[180px]"
                  data-ocid={`scanner.sample.item.${i + 1}`}
                >
                  {s.replace("https://", "").replace("http://", "")}
                </button>
              ))}
            </div>
          )}

          {error && (
            <p
              className="text-xs text-destructive font-mono mb-4"
              data-ocid="scanner.error_state"
            >
              {error}
            </p>
          )}

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: visualization */}
            <div className="rounded-lg overflow-hidden border border-border bg-muted/20 relative min-h-[320px]">
              <img
                src="/assets/generated/cyber-scan-hero.dim_900x600.png"
                alt="Cyber threat visualization"
                className={`w-full h-full object-cover transition-all duration-500 ${scanning ? "brightness-50" : "brightness-75"}`}
              />
              {scanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm">
                  <div className="scan-line h-0.5 w-full absolute top-1/2" />
                  <div className="text-center p-6">
                    <div className="w-16 h-16 rounded-full border-2 border-primary/50 animate-[glow-pulse_2s_infinite] flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                    <p className="text-xs font-mono text-primary mb-1 text-glow-cyan">
                      SCANNING TARGET
                    </p>
                    <p className="text-sm font-mono text-foreground/80 truncate max-w-[220px]">
                      {url}
                    </p>
                    <div className="mt-4">
                      <ScanProgressBar stage={scanStage} />
                    </div>
                  </div>
                </div>
              )}
              {!scanning && !result && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Eye className="w-10 h-10 text-primary/40 mx-auto mb-2" />
                    <p className="text-xs font-mono text-muted-foreground">
                      Enter a URL to begin analysis
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right: result panel */}
            <div className="min-h-[320px]">
              <AnimatePresence mode="wait">
                {result ? (
                  <ResultPanel key="result" result={result} />
                ) : scanning ? (
                  <motion.div
                    key="scanning"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center"
                    data-ocid="scanner.loading_state"
                  >
                    <div className="space-y-3 w-full">
                      {[80, 60, 70, 50].map((w) => (
                        <div
                          key={w}
                          className="h-3 bg-muted/50 rounded animate-pulse"
                          style={{ width: `${w}%` }}
                        />
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    className="h-full flex flex-col items-center justify-center gap-3 text-center"
                    data-ocid="scanner.empty_state"
                  >
                    <BarChart3 className="w-12 h-12 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground font-body">
                      Analysis results will appear here
                    </p>
                    <p className="text-xs text-muted-foreground/60 font-mono">
                      8 heuristic rules · real-time scoring
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── App root ─────────────────────────────────────────────────────────────────

export default function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <Layout>
      <ScannerSection />
      <Statistics />
      <HowItWorks />
      <CapabilitiesSection />
      <ThreatFeed />
      <CTASection />
    </Layout>
  );
}
