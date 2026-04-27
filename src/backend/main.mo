import Text "mo:core/Text";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Nat "mo:core/Nat";

actor {

  // ── Types ──────────────────────────────────────────────────────────────────

  public type BreakdownItem = {
    rule        : Text;
    status      : Text; // "safe" | "warning" | "danger"
    description : Text;
    detail      : Text;
  };

  public type ScanResult = {
    riskScore : Nat;
    verdict   : Text; // "safe" | "suspicious" | "phishing" | "error"
    breakdown : [BreakdownItem];
  };

  public type ScanRecord = {
    url       : Text;
    verdict   : Text;
    riskScore : Nat;
    timestamp : Int;
  };

  // ── Persistent state ───────────────────────────────────────────────────────
  // Stored oldest→newest; we reverse on read to return newest first.

  var scanHistory : [ScanRecord] = [];

  // ── Heuristic helpers ──────────────────────────────────────────────────────

  /// Extract the host portion from a URL (strips scheme and path).
  func extractHost(url : Text) : Text {
    var s = url;
    switch (s.stripStart(#text "https://")) {
      case (?rest) { s := rest };
      case null {
        switch (s.stripStart(#text "http://")) {
          case (?rest) { s := rest };
          case null {};
        };
      };
    };
    let parts = s.split(#char '/');
    switch (parts.next()) {
      case (?host) host;
      case null s;
    };
  };

  /// Count occurrences of a character in text.
  func countChar(t : Text, c : Char) : Nat {
    var n = 0;
    for (ch in t.toIter()) {
      if (ch == c) { n += 1 };
    };
    n;
  };

  /// Check whether host looks like a bare IPv4 address (digits and dots only).
  func looksLikeIp(host : Text) : Bool {
    if (host.size() == 0) return false;
    var allDigitsAndDots = true;
    var hasDigit = false;
    for (c in host.toIter()) {
      if (c == '.') {
        // dots are fine
      } else if (c >= '0' and c <= '9') {
        hasDigit := true;
      } else {
        allDigitsAndDots := false;
      };
    };
    allDigitsAndDots and hasDigit
  };

  /// Count dot-separated labels in the host (subdomain depth).
  func labelCount(host : Text) : Nat {
    countChar(host, '.') + 1
  };

  /// Levenshtein edit distance between two texts.
  func editDistance(a : Text, b : Text) : Nat {
    let av = a.toArray();
    let bv = b.toArray();
    let m = av.size();
    let n = bv.size();
    if (m == 0) return n;
    if (n == 0) return m;

    var prev : [var Nat] = Array.tabulate<Nat>(n + 1, func i = i).toVarArray();
    var curr : [var Nat] = Array.tabulate<Nat>(n + 1, func _ = 0).toVarArray();

    var i = 1;
    while (i <= m) {
      curr[0] := i;
      var j = 1;
      while (j <= n) {
        let cost = if (av[i - 1] == bv[j - 1]) 0 else 1;
        curr[j] := Nat.min(prev[j] + 1, Nat.min(curr[j - 1] + 1, prev[j - 1] + cost));
        j += 1;
      };
      let tmp = prev;
      prev := curr;
      curr := tmp;
      i += 1;
    };
    prev[n]
  };

  // ── 8 Heuristic rules ──────────────────────────────────────────────────────

  func checkHttps(url : Text) : BreakdownItem {
    if (url.startsWith(#text "https://")) {
      { rule = "HTTPS Security"; status = "safe";
        description = "Secure HTTPS connection";
        detail = "The URL uses HTTPS, indicating an encrypted connection." }
    } else {
      { rule = "HTTPS Security"; status = "danger";
        description = "No HTTPS encryption";
        detail = "This URL does not use HTTPS. Phishing sites often use plain HTTP to steal data." }
    }
  };

  func checkUrlLength(url : Text) : BreakdownItem {
    let len = url.size();
    if (len > 150) {
      { rule = "URL Length"; status = "danger";
        description = "Extremely long URL (" # len.toText() # " chars)";
        detail = "URLs over 150 characters are a strong indicator of obfuscation used in phishing attacks." }
    } else if (len > 100) {
      { rule = "URL Length"; status = "warning";
        description = "Long URL (" # len.toText() # " chars)";
        detail = "Unusually long URLs can hide malicious destinations or confuse users." }
    } else {
      { rule = "URL Length"; status = "safe";
        description = "Normal URL length (" # len.toText() # " chars)";
        detail = "The URL length is within a normal range." }
    }
  };

  func checkIpDomain(url : Text) : BreakdownItem {
    let host = extractHost(url);
    if (looksLikeIp(host)) {
      { rule = "IP Address Domain"; status = "danger";
        description = "Domain is a raw IP address";
        detail = "Using an IP address instead of a domain name is a common phishing tactic." }
    } else {
      { rule = "IP Address Domain"; status = "safe";
        description = "Uses a proper domain name";
        detail = "The URL uses a domain name rather than a raw IP address." }
    }
  };

  func checkSubdomainDepth(url : Text) : BreakdownItem {
    let host  = extractHost(url);
    let depth = labelCount(host);
    if (depth > 4) {
      { rule = "Subdomain Depth"; status = "danger";
        description = "Excessive subdomain nesting (" # depth.toText() # " labels)";
        detail = "Deeply nested subdomains are often used to disguise phishing URLs (e.g. paypal.com.evil.com)." }
    } else if (depth > 3) {
      { rule = "Subdomain Depth"; status = "warning";
        description = "Multiple subdomains detected (" # depth.toText() # " labels)";
        detail = "Multiple subdomains can be used to disguise the real domain." }
    } else {
      { rule = "Subdomain Depth"; status = "safe";
        description = "Normal subdomain structure";
        detail = "The subdomain depth is within a normal range." }
    }
  };

  func checkSuspiciousTld(url : Text) : BreakdownItem {
    let host = extractHost(url).toLower();
    let dangerTlds  = [".tk", ".ml", ".ga", ".cf", ".gq"];
    let warningTlds = [".xyz", ".top", ".click", ".link"];

    if (dangerTlds.any<Text>(func t = host.endsWith(#text t))) {
      { rule = "Suspicious TLD"; status = "danger";
        description = "High-risk top-level domain";
        detail = "This domain uses a TLD (.tk, .ml, .ga, .cf, .gq) heavily abused in phishing campaigns." }
    } else if (warningTlds.any<Text>(func t = host.endsWith(#text t))) {
      { rule = "Suspicious TLD"; status = "warning";
        description = "Potentially risky top-level domain";
        detail = "TLDs like .xyz, .top, .click, and .link are frequently associated with spam and phishing." }
    } else {
      { rule = "Suspicious TLD"; status = "safe";
        description = "Standard top-level domain";
        detail = "The domain TLD does not appear on suspicious TLD lists." }
    }
  };

  func checkSuspiciousKeywords(url : Text) : BreakdownItem {
    let lower = url.toLower();
    let dangerKws  = ["credential", "password", "signin"];
    let warningKws = ["login", "bank", "verify", "secure", "account", "update", "confirm", "paypal"];

    if (dangerKws.any<Text>(func k = lower.contains(#text k))) {
      { rule = "Suspicious Keywords"; status = "danger";
        description = "High-risk keywords detected in URL";
        detail = "Keywords like 'credential', 'password', or 'signin' in a URL are strong phishing indicators." }
    } else if (warningKws.any<Text>(func k = lower.contains(#text k))) {
      { rule = "Suspicious Keywords"; status = "warning";
        description = "Suspicious keywords found in URL";
        detail = "Words like 'login', 'verify', 'secure', or 'confirm' are often used in phishing URLs." }
    } else {
      { rule = "Suspicious Keywords"; status = "safe";
        description = "No suspicious keywords detected";
        detail = "The URL does not contain keywords commonly associated with phishing attacks." }
    }
  };

  func checkSpecialChars(url : Text) : BreakdownItem {
    var count = 0;
    for (c in url.toIter()) {
      if (c == '@' or c == '%' or c == '-' or c == '_' or
          c == '~' or c == '!' or c == '*' or c == '(' or c == ')') {
        count += 1;
      };
    };
    if (count > 10) {
      { rule = "Special Characters"; status = "danger";
        description = "Excessive special characters (" # count.toText() # " found)";
        detail = "More than 10 special characters is a strong obfuscation signal used in phishing." }
    } else if (count > 5) {
      { rule = "Special Characters"; status = "warning";
        description = "Multiple special characters (" # count.toText() # " found)";
        detail = "Elevated special character count may indicate URL obfuscation." }
    } else {
      { rule = "Special Characters"; status = "safe";
        description = "Normal special character usage (" # count.toText() # " found)";
        detail = "The number of special characters is within a normal range." }
    }
  };

  func checkTyposquatting(url : Text) : BreakdownItem {
    let host = extractHost(url).toLower();
    let knownDomains = ["google", "paypal", "amazon", "microsoft", "apple", "facebook", "netflix"];

    let segments    = host.split(#char '.').toArray();
    let n           = segments.size();
    let registrable = if (n >= 2) segments[n - 2] else host;

    // Exact match — not typosquatting
    if (knownDomains.any<Text>(func d = registrable == d)) {
      return { rule = "Typosquatting"; status = "safe";
               description = "Matches a known legitimate domain";
               detail = "The domain matches a well-known legitimate site." };
    };

    // Edit distance <= 2 and > 0 → likely typosquatting
    let closest = knownDomains.find(func d = editDistance(registrable, d) <= 2 and editDistance(registrable, d) > 0);
    switch (closest) {
      case (?match) {
        { rule = "Typosquatting"; status = "danger";
          description = "Possible typosquatting of '" # match # "'";
          detail = "The domain is very similar to '" # match # "', a known legitimate site. Classic phishing tactic." }
      };
      case null {
        { rule = "Typosquatting"; status = "safe";
          description = "No typosquatting detected";
          detail = "The domain does not closely resemble any known legitimate domain." }
      };
    }
  };

  // ── Scoring ────────────────────────────────────────────────────────────────

  func statusWeight(status : Text) : Nat {
    if (status == "danger") 30
    else if (status == "warning") 15
    else 0
  };

  func computeScore(items : [BreakdownItem]) : Nat {
    let raw = items.foldLeft(0, func(acc, item) = acc + statusWeight(item.status));
    Nat.min(raw, 100)
  };

  func scoreToVerdict(score : Nat) : Text {
    if (score >= 70) "phishing"
    else if (score >= 31) "suspicious"
    else "safe"
  };

  // ── Public API ─────────────────────────────────────────────────────────────

  public func scanUrl(url : Text) : async ScanResult {
    let trimmed = url.trimStart(#char ' ').trimEnd(#char ' ');

    if (trimmed.size() == 0) {
      return {
        riskScore = 0;
        verdict   = "error";
        breakdown = [{
          rule        = "Input Validation";
          status      = "danger";
          description = "Empty URL provided";
          detail      = "Please provide a valid URL to scan.";
        }];
      };
    };

    let hasScheme = trimmed.startsWith(#text "http://") or trimmed.startsWith(#text "https://");
    if (not hasScheme) {
      return {
        riskScore = 50;
        verdict   = "suspicious";
        breakdown = [{
          rule        = "Input Validation";
          status      = "warning";
          description = "URL missing http/https scheme";
          detail      = "The URL does not start with http:// or https://. Treating as suspicious.";
        }];
      };
    };

    let breakdown = [
      checkHttps(trimmed),
      checkUrlLength(trimmed),
      checkIpDomain(trimmed),
      checkSubdomainDepth(trimmed),
      checkSuspiciousTld(trimmed),
      checkSuspiciousKeywords(trimmed),
      checkSpecialChars(trimmed),
      checkTyposquatting(trimmed),
    ];

    let riskScore = computeScore(breakdown);
    let verdict   = scoreToVerdict(riskScore);

    // Persist — oldest at index 0, newest at end.
    // Cap at 100: drop oldest entries if needed.
    let newRecord : ScanRecord = {
      url       = trimmed;
      verdict;
      riskScore;
      timestamp = Time.now();
    };
    let appended = scanHistory.concat([newRecord]);
    scanHistory := if (appended.size() > 100) {
      Array.tabulate<ScanRecord>(100, func i = appended[appended.size() - 100 + i])
    } else {
      appended
    };

    { riskScore; verdict; breakdown }
  };

  /// Returns up to `limit` most-recent scans (newest first).
  /// Pass 0 to get all.
  public query func getScanHistory(limit : Nat) : async [ScanRecord] {
    let total = scanHistory.size();
    if (total == 0) return [];
    // Reverse to get newest first
    let reversed = Array.tabulate(total, func i = scanHistory[total - 1 - i]);
    let cap = if (limit == 0 or limit > total) total else limit;
    Array.tabulate<ScanRecord>(cap, func i = reversed[i])
  };

  /// Returns up to 20 most-recent phishing/suspicious scans (newest first).
  public query func getThreatFeed() : async [ScanRecord] {
    let total = scanHistory.size();
    if (total == 0) return [];
    let reversed = Array.tabulate(total, func i = scanHistory[total - 1 - i]);
    let threats = reversed.filter(func(r : ScanRecord) : Bool {
      r.verdict == "phishing" or r.verdict == "suspicious"
    });
    let cap = if (threats.size() > 20) 20 else threats.size();
    Array.tabulate<ScanRecord>(cap, func i = threats[i])
  };
}
