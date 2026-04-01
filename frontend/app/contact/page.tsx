import type { Metadata } from "next";
import Image from "next/image";
import GlassCard from "@/components/ui/GlassCard";
import ContactForm from "@/components/sections/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with PT Agra Energi Indonesia. Contact our team about investment opportunities and partnerships.",
};

export default function ContactPage() {
  return (
    <main className="pt-20">
      <section className="py-16 md:py-24 px-4 bg-bg">
        <div className="mx-auto" style={{ maxWidth: "var(--container-lg)" }}>
          <div className="lg:grid lg:grid-cols-[5fr_7fr] lg:items-start">

            {/* Jakarta office — warm accent, peeks behind glass card */}
            <div className="relative rounded-xl overflow-hidden aspect-[16/9] lg:aspect-[4/5] mb-8 lg:mb-0 lg:mt-14 lg:mr-[-5rem] shadow-md">
              <Image
                src="/images/supplements/jkt_office.jpg"
                alt="AEI Jakarta office at Equity Tower, SCBD"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
                quality={80}
              />
              {/* Darken the overlap edge for text readability on the glass card */}
              <div
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
                style={{
                  background:
                    "linear-gradient(to left, rgba(0,0,0,0.35), transparent 60%)",
                }}
              />
            </div>

            {/* Form card — glass frosts the image overlap on the left edge */}
            <div className="relative z-10">
              <GlassCard variant="subtle" className="p-6 md:p-8">
                <ContactForm />

                {/* Contact details — compact strip */}
                <div className="mt-8 pt-6 border-t border-border-subtle">
                  <ul
                    className="flex flex-col sm:flex-row flex-wrap gap-x-10 gap-y-5"
                    aria-label="Contact details"
                  >
                    <li>
                      <p className="font-body text-small text-fg-muted uppercase tracking-wider mb-1">
                        Phone
                      </p>
                      <a
                        href="tel:+622172183023"
                        className="font-body text-body text-fg hover:text-primary transition-colors"
                      >
                        +62 21 7183023
                      </a>
                    </li>
                    <li>
                      <p className="font-body text-small text-fg-muted uppercase tracking-wider mb-1">
                        Email
                      </p>
                      <a
                        href="mailto:contact@aei-1.com"
                        className="font-body text-body text-fg hover:text-primary transition-colors"
                      >
                        contact@aei-1.com
                      </a>
                    </li>
                    <li>
                      <p className="font-body text-small text-fg-muted uppercase tracking-wider mb-1">
                        Office
                      </p>
                      <address className="font-body text-body text-fg not-italic">
                        Equity Tower, Level 35 — SCBD, Jakarta
                      </address>
                    </li>
                  </ul>
                  <p className="font-body text-small text-fg-muted mt-5">
                    We typically respond within 2 business days.
                  </p>
                </div>
              </GlassCard>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
