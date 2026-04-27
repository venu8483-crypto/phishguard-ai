import {
  Clock,
  Link2,
  MessageSquareWarning,
  Network,
  Search,
  ShieldCheck,
} from "lucide-react";
import { motion } from "motion/react";

interface Capability {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

const CAPABILITIES: Capability[] = [
  {
    id: "realtime-url",
    icon: Search,
    title: "Real-Time URL Analysis",
    description:
      "Instant multi-rule heuristic evaluation of any URL. Our engine processes 8 detection patterns simultaneously and returns a weighted risk score in under 250ms — no external lookups required.",
  },
  {
    id: "ssl-tls",
    icon: ShieldCheck,
    title: "SSL/TLS Certificate Inspection",
    description:
      "Validates HTTPS enforcement and certificate chain integrity. Unencrypted HTTP connections and self-signed certificates on login pages are immediately flagged as high-risk indicators.",
  },
  {
    id: "domain-age",
    icon: Clock,
    title: "Domain Age & Registration",
    description:
      "New domains registered within 30 days are statistically 40× more likely to be malicious. Our heuristics factor domain freshness into the composite threat score alongside WHOIS signals.",
  },
  {
    id: "keyword",
    icon: MessageSquareWarning,
    title: "Suspicious Keyword Detection",
    description:
      'Scans URL paths, subdomains, and query strings for 20+ social engineering keywords — "verify", "secure-login", "account-update", "confirm-identity" — routinely exploited in phishing kits.',
  },
  {
    id: "typosquatting",
    icon: Link2,
    title: "Typosquatting Detection",
    description:
      "Identifies character-substitution attacks targeting top brands: paypa1.com, g00gle.net, arnazon.com. Catches homoglyph swaps, digit replacements, and hyphen-insertion patterns.",
  },
  {
    id: "subdomain",
    icon: Network,
    title: "Subdomain Structure Analysis",
    description:
      "Deep subdomain trees like secure.login.verify.paypal.attacker.com exploit user trust in legitimate brand names. Our parser isolates the registerable domain and scores suspicious nesting depth.",
  },
];

function CapabilityCard({ cap, index }: { cap: Capability; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.1,
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ scale: 1.025, transition: { duration: 0.2 } }}
      className="group relative rounded-xl p-6 bg-card/40 border border-primary/15 hover:border-primary/50 hover:bg-card/65 hover:glow-cyan transition-smooth cursor-default"
      data-ocid={`capabilities.item.${index + 1}`}
    >
      {/* Corner accent lines */}
      <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-primary/30 rounded-tl-xl opacity-0 group-hover:opacity-100 transition-smooth" />
      <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-primary/30 rounded-br-xl opacity-0 group-hover:opacity-100 transition-smooth" />

      {/* Icon */}
      <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-primary/10 border border-primary/20 group-hover:border-primary/50 group-hover:bg-primary/20 transition-smooth mb-4">
        <cap.icon className="w-5 h-5 text-primary" />
      </div>

      {/* Title */}
      <h3 className="font-display font-bold text-foreground text-sm mb-2 group-hover:text-primary transition-smooth">
        {cap.title}
      </h3>

      {/* Description */}
      <p className="text-xs text-muted-foreground font-body leading-relaxed">
        {cap.description}
      </p>
    </motion.div>
  );
}

export function CapabilitiesSection() {
  return (
    <section
      id="features"
      className="relative py-24 px-4 bg-background overflow-hidden"
      data-ocid="capabilities.section"
    >
      {/* Subtle radial gradient decoration */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/4 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/3 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-xs font-mono text-primary uppercase tracking-widest mb-3">
            What We Detect
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
            Detection Capabilities
          </h2>
          {/* Cyan underline accent */}
          <div className="mx-auto mt-3 flex items-center justify-center gap-2">
            <div className="h-px w-12 bg-primary/30" />
            <div
              className="h-0.5 w-16 bg-primary rounded-full"
              style={{ boxShadow: "0 0 8px rgba(0,217,255,0.6)" }}
            />
            <div className="h-px w-12 bg-primary/30" />
          </div>
          <p className="text-muted-foreground mt-4 font-body max-w-lg mx-auto text-sm">
            Six specialized detection modules, each targeting a distinct attack
            vector used in modern phishing and malicious URL campaigns.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CAPABILITIES.map((cap, i) => (
            <CapabilityCard key={cap.id} cap={cap} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
