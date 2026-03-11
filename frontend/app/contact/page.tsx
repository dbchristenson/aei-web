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
      <section className="py-24 px-4 bg-bg">
        <div className="mx-auto" style={{ maxWidth: "var(--container-lg)" }}>
          <h1 className="text-center font-sans-header font-bold text-fg mb-4 text-h1">
            Get in Touch
          </h1>
          <p className="text-center text-fg-muted font-sans-body mb-16 max-w-xl mx-auto text-body-lg">
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
                    className="block font-sans-body text-fg-secondary mb-2 text-small"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full bg-surface border border-border rounded-[var(--radius-button)] px-4 py-3 text-fg font-sans-body focus:outline-none focus:border-primary transition-colors text-body"
                  />
                </div>
                <div>
                  <label
                    htmlFor="organization"
                    className="block font-sans-body text-fg-secondary mb-2 text-small"
                  >
                    Organization
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    className="w-full bg-surface border border-border rounded-[var(--radius-button)] px-4 py-3 text-fg font-sans-body focus:outline-none focus:border-primary transition-colors text-body"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block font-sans-body text-fg-secondary mb-2 text-small"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full bg-surface border border-border rounded-[var(--radius-button)] px-4 py-3 text-fg font-sans-body focus:outline-none focus:border-primary transition-colors text-body"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block font-sans-body text-fg-secondary mb-2 text-small"
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full bg-surface border border-border rounded-[var(--radius-button)] px-4 py-3 text-fg font-sans-body focus:outline-none focus:border-primary transition-colors text-body"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block font-sans-body text-fg-secondary mb-2 text-small"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full bg-surface border border-border rounded-[var(--radius-button)] px-4 py-3 text-fg font-sans-body focus:outline-none focus:border-primary transition-colors resize-y text-body"
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
