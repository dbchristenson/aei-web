import type { Metadata } from "next";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with PT Agra Energi Indonesia. Contact our team about investment opportunities and partnerships.",
};

export default function ContactPage() {
  return (
    <main className="pt-20">
      <section className="py-24 px-4 bg-neutral-950">
        <div className="mx-auto" style={{ maxWidth: "var(--container-lg)" }}>
          <h1
            className="text-center font-sans-header font-bold text-neutral-50 mb-4"
            style={{ fontSize: "var(--text-h1)", lineHeight: 1.2 }}
          >
            Get in Touch
          </h1>
          <p
            className="text-center text-neutral-400 font-sans-body mb-16 max-w-xl mx-auto"
            style={{ fontSize: "var(--text-body-lg)" }}
          >
            Interested in exploring investment opportunities or partnerships?
            We&apos;d love to hear from you.
          </p>

          <GlassCard variant="dark" className="p-8 md:p-12 max-w-2xl mx-auto">
            {/* TODO: Wire form to POST /api/contact with validation */}
            {/* TODO: Add honeypot field for spam prevention */}
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block font-sans-body text-neutral-200 mb-2"
                    style={{ fontSize: "var(--text-small)" }}
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-[var(--radius-button)] px-4 py-3 text-neutral-50 font-sans-body focus:outline-none focus:border-teal-blue transition-colors"
                    style={{ fontSize: "var(--text-body)" }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="organization"
                    className="block font-sans-body text-neutral-200 mb-2"
                    style={{ fontSize: "var(--text-small)" }}
                  >
                    Organization
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-[var(--radius-button)] px-4 py-3 text-neutral-50 font-sans-body focus:outline-none focus:border-teal-blue transition-colors"
                    style={{ fontSize: "var(--text-body)" }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block font-sans-body text-neutral-200 mb-2"
                    style={{ fontSize: "var(--text-small)" }}
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-[var(--radius-button)] px-4 py-3 text-neutral-50 font-sans-body focus:outline-none focus:border-teal-blue transition-colors"
                    style={{ fontSize: "var(--text-body)" }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block font-sans-body text-neutral-200 mb-2"
                    style={{ fontSize: "var(--text-small)" }}
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-[var(--radius-button)] px-4 py-3 text-neutral-50 font-sans-body focus:outline-none focus:border-teal-blue transition-colors"
                    style={{ fontSize: "var(--text-body)" }}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block font-sans-body text-neutral-200 mb-2"
                  style={{ fontSize: "var(--text-small)" }}
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-[var(--radius-button)] px-4 py-3 text-neutral-50 font-sans-body focus:outline-none focus:border-teal-blue transition-colors resize-y"
                  style={{ fontSize: "var(--text-body)" }}
                />
              </div>

              <div className="pt-2">
                <Button type="submit" size="lg">
                  Send Message
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>
      </section>
    </main>
  );
}
