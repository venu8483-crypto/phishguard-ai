import { BarChart3, Layers, Link, Search } from "lucide-react";
import { motion } from "motion/react";

const STEPS = [
  {
    step: "01",
    title: "URL Ingestion & Parsing",
    desc: "Submit any URL for analysis. The system extracts structural features including protocol, domain, path, parameters, and fragment identifiers for examination.",
    icon: Link,
  },
  {
    step: "02",
    title: "Feature Extraction",
    desc: "30+ distinct features are extracted from the URL structure, including length, special character density, subdomain count, and TLD classification.",
    icon: Layers,
  },
  {
    step: "03",
    title: "Pattern Recognition",
    desc: "Extracted features are compared against known phishing signatures and analyzed for typosquatting patterns, brand impersonation, and suspicious keyword combinations.",
    icon: Search,
  },
  {
    step: "04",
    title: "Risk Score Generation",
    desc: "A weighted scoring algorithm aggregates feature signals into a 0–100 risk score. Scores above 70 are flagged as phishing; 40–69 as suspicious; below 40 as safe.",
    icon: BarChart3,
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 px-4 bg-background relative overflow-hidden"
    >
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono text-primary tracking-widest uppercase">
              Detection Pipeline
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-3">
            How It Works
          </h2>
          <p className="text-muted-foreground font-body text-lg max-w-md mx-auto">
            Four-step detection pipeline
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Horizontal connector line (desktop) */}
          <div className="hidden lg:block absolute top-[38px] left-[calc(12.5%+20px)] right-[calc(12.5%+20px)] h-px bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="flex flex-col items-center text-center group"
                data-ocid={`how_it_works.item.${i + 1}`}
              >
                {/* Step circle */}
                <div className="relative mb-6">
                  {/* Outer glow ring */}
                  <div className="absolute inset-0 rounded-full bg-primary/10 blur-md scale-150 opacity-0 group-hover:opacity-100 transition-smooth" />
                  <div className="relative w-16 h-16 rounded-full bg-card border-2 border-primary/40 group-hover:border-primary/80 flex flex-col items-center justify-center transition-smooth group-hover:glow-cyan">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  {/* Step number badge */}
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-[9px] font-mono font-bold text-primary-foreground">
                      {i + 1}
                    </span>
                  </div>
                </div>

                {/* Vertical connector (mobile) */}
                {i < STEPS.length - 1 && (
                  <div className="lg:hidden w-px h-8 bg-gradient-to-b from-primary/40 to-primary/10 mb-0 -mt-2 order-last" />
                )}

                {/* Content */}
                <div className="space-y-2">
                  <p className="text-[10px] font-mono text-primary/60 tracking-widest uppercase">
                    {step.step}
                  </p>
                  <h3 className="font-display font-bold text-foreground text-base leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
