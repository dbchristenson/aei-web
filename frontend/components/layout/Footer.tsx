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
    <footer className="bg-neutral-900 border-t border-neutral-800">
      <div
        className="mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
        style={{ maxWidth: "var(--container-xl)" }}
      >
        {/* Brand */}
        <div>
          <p
            className="font-serif font-bold text-neutral-50"
            style={{ fontSize: "var(--text-h3)" }}
          >
            AEI
          </p>
          <p
            className="mt-2 text-neutral-400 font-sans-body"
            style={{ fontSize: "var(--text-small)" }}
          >
            PT Agra Energi Indonesia
          </p>
          <p
            className="mt-1 text-neutral-400 font-sans-body"
            style={{ fontSize: "var(--text-small)" }}
          >
            High-impact oil &amp; gas exploration and geothermal development in
            Indonesia.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3
            className="font-sans-header font-semibold text-neutral-50 mb-4"
            style={{ fontSize: "var(--text-body)" }}
          >
            Company
          </h3>
          <ul className="space-y-2">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-neutral-400 hover:text-neutral-100 transition-colors font-sans-body"
                  style={{ fontSize: "var(--text-small)" }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal & Governance */}
        <div>
          <h3
            className="font-sans-header font-semibold text-neutral-50 mb-4"
            style={{ fontSize: "var(--text-body)" }}
          >
            Legal &amp; Governance
          </h3>
          <ul className="space-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-neutral-400 hover:text-neutral-100 transition-colors font-sans-body"
                  style={{ fontSize: "var(--text-small)" }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3
            className="font-sans-header font-semibold text-neutral-50 mb-4"
            style={{ fontSize: "var(--text-body)" }}
          >
            Contact
          </h3>
          {/* TODO: Replace with actual contact details from client */}
          <address
            className="not-italic text-neutral-400 font-sans-body space-y-2"
            style={{ fontSize: "var(--text-small)" }}
          >
            <p>Jakarta, Indonesia</p>
            <p>info@agraenergi.com</p>
          </address>
        </div>
      </div>

      <div className="border-t border-neutral-800 py-6 px-4 text-center">
        <p
          className="text-neutral-600 font-sans-body"
          style={{ fontSize: "var(--text-xs)" }}
        >
          &copy; {new Date().getFullYear()} PT Agra Energi Indonesia. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
