import { ArrowRight, Shield, Zap } from "lucide-react";
import { motion } from "motion/react";

export function CTASection() {
  function scrollToScanner() {
    document.getElementById("scanner")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="relative py-16 px-4 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.10_0.02_260)] via-[oklch(0.13_0.04_260)] to-[oklch(0.10_0.01_260)]" />

      {/* Ambient cyan glow blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/3 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/3 rounded-full blur-3xl pointer-events-none" />

      {/* Top border glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="cyber-border rounded-2xl p-8 sm:p-12 bg-card/20 backdrop-blur-sm text-center"
          data-ocid="cta.section"
        >
          {/* Icon cluster */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary/60" />
            </div>
            <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/40 flex items-center justify-center glow-cyan">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary/60" />
            </div>
          </div>

          {/* Text */}
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-3">
            Stay <span className="text-primary text-glow-cyan">Protected</span>{" "}
            Online
          </h2>
          <p className="text-muted-foreground font-body text-base sm:text-lg max-w-lg mx-auto mb-8">
            Run a free scan on any suspicious URL and get instant threat
            analysis.
          </p>

          {/* CTA Button */}
          <motion.button
            type="button"
            onClick={scrollToScanner}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-primary/15 hover:bg-primary/25 border border-primary/40 hover:border-primary/70 text-primary font-display font-semibold text-base rounded-lg transition-smooth hover-glow-cyan"
            data-ocid="cta.scan_button"
          >
            Scan a URL Now
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-border/40">
            {[
              { label: "No account required", dot: "bg-green-400" },
              { label: "Instant results", dot: "bg-primary" },
              { label: "Enterprise-grade analysis", dot: "bg-primary" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
                <span className="text-xs font-mono text-muted-foreground">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
