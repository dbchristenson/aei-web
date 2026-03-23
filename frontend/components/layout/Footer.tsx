import Link from "next/link";

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

export default function Footer() {
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
          <p className="mt-2 text-fg-muted font-sans-body text-small">
            PT Agra Energi Indonesia
          </p>
          <p className="mt-1 text-fg-muted font-sans-body text-small">
            High-impact oil &amp; gas exploration and geothermal development in
            Indonesia.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h2 className="font-sans-header font-semibold text-fg mb-4 text-body">
            Company
          </h2>
          <ul className="space-y-2">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-fg-muted hover:text-fg-secondary transition-colors font-sans-body text-small"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal & Governance */}
        <div>
          <h2 className="font-sans-header font-semibold text-fg mb-4 text-body">
            Legal &amp; Governance
          </h2>
          <ul className="space-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-fg-muted hover:text-fg-secondary transition-colors font-sans-body text-small"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="font-sans-header font-semibold text-fg mb-4 text-body">
            Contact
          </h2>
          {/* TODO: Replace with actual contact details from client */}
          <address className="not-italic text-fg-muted font-sans-body space-y-2 text-small">
            <p>Jakarta, Indonesia</p>
            <p>info@agraenergi.com</p>
          </address>
        </div>
      </div>

      <div className="border-t border-border-subtle py-6 px-4 text-center">
        <p className="text-fg-muted font-sans-body text-xs">
          &copy; {new Date().getFullYear()} PT Agra Energi Indonesia. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
