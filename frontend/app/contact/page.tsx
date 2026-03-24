import type { Metadata } from "next";
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
      <section className="py-24 px-4 bg-bg">
        <div className="mx-auto" style={{ maxWidth: "var(--container-lg)" }}>
          <h1 className="text-center font-sans font-bold text-fg mb-4 text-h1">
            Contact Us
          </h1>
          <p className="text-center text-fg-muted font-body mb-16 max-w-xl mx-auto text-body-lg">
            Interested in exploring investment opportunities or partnerships?
            We&apos;d love to hear from you.
          </p>

          <GlassCard variant="light" className="p-8 md:p-12 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

              {/* Left column — Direct contact info */}
              <div className="flex flex-col gap-8">
                <div>
                  <h2 className="font-sans font-semibold text-h2 text-fg mb-3">
                    Get in Touch
                  </h2>
                  <p className="font-body text-fg-secondary text-body">
                    Reach out directly or fill out the form to start a
                    conversation.
                  </p>
                </div>

                <ul className="space-y-6" aria-label="Contact details">
                  {/* Phone */}
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0 text-primary" aria-hidden="true">
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-body text-small text-fg-muted uppercase tracking-wider mb-1">
                        Phone
                      </p>
                      <a
                        href="tel:+622172183023"
                        className="font-body text-body text-fg hover:text-primary transition-colors"
                      >
                        +62 21 7183023
                      </a>
                    </div>
                  </li>

                  {/* Email */}
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0 text-primary" aria-hidden="true">
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-body text-small text-fg-muted uppercase tracking-wider mb-1">
                        Email
                      </p>
                      <a
                        href="mailto:contact@aei-1.com"
                        className="font-body text-body text-fg hover:text-primary transition-colors"
                      >
                        contact@aei-1.com
                      </a>
                    </div>
                  </li>

                  {/* Address */}
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0 text-primary" aria-hidden="true">
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-body text-small text-fg-muted uppercase tracking-wider mb-1">
                        Registered Address
                      </p>
                      <address className="font-body text-body text-fg not-italic leading-relaxed">
                        Equity Tower – Level 35
                        <br />
                        SCBD Lot 9
                        <br />
                        Jl. Jend Sudirman, Kav. 52-53
                        <br />
                        Jakarta 12190
                        <br />
                        Indonesia
                      </address>
                    </div>
                  </li>
                </ul>

                <p className="font-body text-small text-fg-muted mt-auto">
                  We typically respond within 2 business days.
                </p>
              </div>

              {/* Right column — Contact form */}
              <div>
                <ContactForm />
              </div>

            </div>
          </GlassCard>
        </div>
      </section>
    </main>
  );
}
