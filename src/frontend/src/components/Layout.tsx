import { Shield } from "lucide-react";

const NAV_LINKS = [
  { label: "Scanner", href: "#scanner" },
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-card/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5" data-ocid="navbar.logo">
            <div className="p-1.5 rounded-md bg-primary/10 border border-primary/30 glow-cyan">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="font-display font-bold text-foreground tracking-tight text-sm">
                PhishGuard
              </span>
              <span className="font-display font-bold text-primary text-sm ml-0.5 text-glow-cyan">
                {" "}
                AI
              </span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href.slice(1))}
                className="text-sm font-body text-muted-foreground hover:text-foreground transition-smooth hover:text-primary"
                type="button"
                data-ocid={`navbar.${link.label.toLowerCase()}_link`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* CTA */}
          <button
            type="button"
            onClick={() => scrollTo("scanner")}
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-display font-semibold rounded-md bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-smooth hover-glow-cyan"
            data-ocid="navbar.scan_cta_button"
          >
            <Shield className="w-4 h-4" />
            Scan URL
          </button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "";
  return (
    <footer className="bg-card border-t border-border py-10" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-primary/10 border border-primary/30">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-bold text-sm text-foreground">
              PhishGuard<span className="text-primary"> AI</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-body text-center">
            Enterprise-grade URL threat intelligence. Real-time phishing
            detection powered by heuristic analysis.
          </p>
          <p className="text-xs text-muted-foreground font-body">
            © {year}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-smooth"
            >
              Built with love using caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background dark flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  );
}
