"use client";

import Link from "next/link";
import { useCallback } from "react";

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
  const handleCopyAddress = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(ADDRESS);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = ADDRESS;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  }, []);

  return (
    <footer className="relative z-10" style={{ backgroundColor: "var(--color-palette-primary-dark)" }}>
      <div
        className="mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
        style={{ maxWidth: "var(--container-xl)" }}
      >
        {/* Brand */}
        <div>
          <p className="font-serif font-bold text-fg-inverse text-h3">
            AEI
          </p>
          <p className="mt-2 text-fg-inverse font-body text-small">
            PT Agra Energi Indonesia
          </p>
          <p className="mt-1 text-fg-inverse font-body text-small">
            High-impact oil &amp; gas exploration and geothermal development in
            Indonesia.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h2 className="font-sans font-semibold text-fg-inverse mb-4 text-body">
            Company
          </h2>
          <ul className="space-y-2">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-fg-inverse hover:text-accent transition-colors font-body text-small"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal & Governance */}
        <div>
          <h2 className="font-sans font-semibold text-fg-inverse mb-4 text-body">
            Legal &amp; Governance
          </h2>
          <ul className="space-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-fg-inverse hover:text-accent transition-colors font-body text-small"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="font-sans font-semibold text-fg-inverse mb-4 text-body">
            Contact
          </h2>
          <address className="not-italic text-fg-inverse font-body space-y-2 text-small">
            <p>
              <a href="tel:+622171830231" className="hover:text-accent transition-colors">
                +62 21 7183023
              </a>
            </p>
            <p>
              <a href="mailto:contact@aei-1.com" className="hover:text-accent transition-colors">
                contact@aei-1.com
              </a>
            </p>
            <p
              onClick={handleCopyAddress}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label="Copy address to clipboard"
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleCopyAddress(); }}
            >
              Equity Tower – Level 35<br />
              SCBD Lot 9<br />
              Jl. Jend Sudirman, Kav. 52-53<br />
              Jakarta 12190, Indonesia
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-primary py-6 px-4 text-center">
        <p className="text-fg-muted font-body text-xs">
          &copy; {new Date().getFullYear()} PT Agra Energi Indonesia. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
