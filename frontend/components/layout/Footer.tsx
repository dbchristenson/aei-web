"use client";

import Link from "next/link";
import { useState, useCallback } from "react";

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Team", href: "/team" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

const legalLinks = [
  { label: "Anti-Corruption Policy", href: "/governance/anti-corruption" },
  { label: "Code of Conduct", href: "/governance/code-of-conduct" },
  { label: "Communications Policy", href: "/governance/communications" },
  { label: "Drugs & Alcohol Policy", href: "/governance/drugs-alcohol" },
];

const ADDRESS = `Equity Tower – Level 35\nSCBD Lot 9\nJl. Jend Sudirman, Kav. 52-53\nJakarta 12190, Indonesia`;

export default function Footer() {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = ADDRESS;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  return (
    <footer className="bg-bg-subtle border-t border-border-subtle">
      <div
        className="mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
        style={{ maxWidth: "var(--container-xl)" }}
      >
        {/* Brand */}
        <div>
          <p className="font-serif font-bold text-fg text-h3">
            AEI
          </p>
          <p className="mt-2 text-fg-muted font-body text-small">
            PT Agra Energi Indonesia
          </p>
          <p className="mt-1 text-fg-muted font-body text-small">
            High-impact oil &amp; gas exploration and geothermal development in
            Indonesia.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h2 className="font-sans font-semibold text-fg mb-4 text-body">
            Company
          </h2>
          <ul className="space-y-2">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-fg-muted hover:text-fg-secondary transition-colors font-body text-small"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal & Governance */}
        <div>
          <h2 className="font-sans font-semibold text-fg mb-4 text-body">
            Legal &amp; Governance
          </h2>
          <ul className="space-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-fg-muted hover:text-fg-secondary transition-colors font-body text-small"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="font-sans font-semibold text-fg mb-4 text-body">
            Contact
          </h2>
          <address className="not-italic text-fg-muted font-body space-y-2 text-small">
            <p>
              <a href="tel:+622171830231" className="hover:text-fg-secondary transition-colors">
                +62 21 7183023
              </a>
            </p>
            <p>
              <a href="mailto:contact@aei-1.com" className="hover:text-fg-secondary transition-colors">
                contact@aei-1.com
              </a>
            </p>
            <div className="relative w-fit">
              <button
                type="button"
                onClick={handleCopyAddress}
                className="text-left p-3 -ml-3 rounded-[var(--radius-button)]
                  hover:bg-surface-hover hover:ring-1 hover:ring-border
                  cursor-pointer group"
                aria-label="Copy address to clipboard"
              >
                <p className="text-fg-muted group-hover:text-fg-secondary">
                  Equity Tower – Level 35<br />
                  SCBD Lot 9<br />
                  Jl. Jend Sudirman, Kav. 52-53<br />
                  Jakarta 12190, Indonesia
                </p>
              </button>

              {copied && (
                <div
                  className="absolute -top-2 right-2 flex items-center gap-1 px-2.5 py-1 rounded-[var(--radius-pill)] bg-success text-fg-inverse font-sans font-medium text-xs pointer-events-none"
                  role="status"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2.5 6.5L5 9l4.5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Copied
                </div>
              )}
            </div>
          </address>
        </div>
      </div>

      <div className="border-t border-border-subtle py-6 px-4 text-center">
        <p className="text-fg-muted font-body text-xs">
          &copy; {new Date().getFullYear()} PT Agra Energi Indonesia. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
