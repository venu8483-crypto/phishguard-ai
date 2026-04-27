import { Activity, Database, TrendingUp, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface StatConfig {
  id: string;
  rawValue: number;
  displaySuffix: string;
  displayPrefix: string;
  label: string;
  description: string;
  icon: React.ElementType;
  decimals: number;
}

const STATS: StatConfig[] = [
  {
    id: "accuracy",
    rawValue: 96,
    displayPrefix: "",
    displaySuffix: "%",
    label: "Detection Accuracy",
    description:
      "Industry-leading precision using Random Forest classification with 10-fold cross-validation.",
    icon: TrendingUp,
    decimals: 0,
  },
  {
    id: "speed",
    rawValue: 220,
    displayPrefix: "~",
    displaySuffix: "ms",
    label: "Average Scan Speed",
    description:
      "Sub-second heuristic analysis pipeline running 8 detection rules in parallel.",
    icon: Zap,
    decimals: 0,
  },
  {
    id: "analyzed",
    rawValue: 50,
    displayPrefix: "",
    displaySuffix: "K+",
    label: "URLs Analyzed",
    description:
      "Continuously growing threat dataset powering adaptive detection models.",
    icon: Database,
    decimals: 0,
  },
  {
    id: "uptime",
    rawValue: 99.2,
    displayPrefix: "",
    displaySuffix: "%",
    label: "Platform Uptime",
    description:
      "Enterprise SLA-grade reliability with distributed, fault-tolerant architecture.",
    icon: Activity,
    decimals: 1,
  },
];

function useCountUp(target: number, decimals: number, isVisible: boolean) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const duration = 1800;

  useEffect(() => {
    if (!isVisible) return;

    function animate(timestamp: number) {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Number.parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    }

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isVisible, target, decimals]);

  return count;
}

function StatCard({ stat, index }: { stat: StatConfig; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const count = useCountUp(stat.rawValue, stat.decimals, isVisible);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const displayValue =
    stat.decimals > 0
      ? count.toFixed(stat.decimals)
      : Math.floor(count).toString();

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.12,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative flex flex-col items-center text-center p-7 rounded-xl bg-card/40 cyber-border hover:bg-card/60 transition-smooth hover:glow-cyan cursor-default"
      data-ocid={`stats_engine.item.${index + 1}`}
    >
      {/* Corner accent */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/40 rounded-tl-xl" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary/40 rounded-br-xl" />

      {/* Icon */}
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/25 mb-4 group-hover:border-primary/50 transition-smooth">
        <stat.icon className="w-5 h-5 text-primary" />
      </div>

      {/* Animated number */}
      <div className="mb-1" aria-live="polite">
        <span className="text-5xl font-display font-bold text-primary text-glow-cyan tabular-nums leading-none">
          {stat.displayPrefix}
          {displayValue}
          {stat.displaySuffix}
        </span>
      </div>

      {/* Label */}
      <p className="text-sm font-display font-semibold text-foreground mb-2 tracking-wide">
        {stat.label}
      </p>

      {/* Divider */}
      <div className="w-8 h-px bg-primary/30 mb-3" />

      {/* Description */}
      <p className="text-xs text-muted-foreground font-body leading-relaxed max-w-[200px]">
        {stat.description}
      </p>
    </motion.div>
  );
}

export function Statistics() {
  return (
    <section
      className="relative py-24 px-4 bg-muted/5 border-y border-border overflow-hidden"
      data-ocid="stats_engine.section"
    >
      {/* Grid texture */}
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-60" />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-xs font-mono text-primary uppercase tracking-widest mb-3">
            By the Numbers
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
            Trusted Detection Engine
          </h2>
          {/* Cyan accent underline */}
          <div className="mx-auto mt-3 flex items-center justify-center gap-2">
            <div className="h-px w-12 bg-primary/30" />
            <div
              className="h-0.5 w-16 bg-primary rounded-full"
              style={{ boxShadow: "0 0 8px rgba(0,217,255,0.6)" }}
            />
            <div className="h-px w-12 bg-primary/30" />
          </div>
          <p className="text-muted-foreground mt-4 font-body max-w-md mx-auto text-sm">
            Performance metrics that define our threat intelligence platform
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {STATS.map((stat, i) => (
            <StatCard key={stat.id} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
