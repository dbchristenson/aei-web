interface PartnerLogo {
  name: string;
  src: string;
  href?: string;
}

interface PartnerLogoGridProps {
  logos: PartnerLogo[];
}

export default function PartnerLogoGrid({ logos }: PartnerLogoGridProps) {
  if (logos.length === 0) return null;

  return (
    <section
      className="py-24 px-4 bg-neutral-900"
      aria-label="Partners and stakeholders"
    >
      <div className="mx-auto" style={{ maxWidth: "var(--container-xl)" }}>
        <h2
          className="text-center font-sans-header font-semibold text-neutral-50 mb-16"
          style={{ fontSize: "var(--text-h2)" }}
        >
          Our Partners &amp; Stakeholders
        </h2>

        {/* TODO: Implement lattice grid layout with SVG connecting lines */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-center justify-items-center">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="group flex items-center justify-center p-6 grayscale hover:grayscale-0 transition-all hover:scale-105"
            >
              {/* TODO: Replace with Next.js <Image> */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.src}
                alt={logo.name}
                className="max-h-16 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
