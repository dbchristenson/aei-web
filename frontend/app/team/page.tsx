import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team",
  description:
    "Meet the leadership team at PT Agra Energi Indonesia — experienced professionals in oil & gas exploration and development.",
};

// TODO: Replace with actual team data from client
const teamMembers = [
  {
    name: "Team Member",
    title: "Director",
    bio: "Biography placeholder. Replace with actual team member details.",
  },
];

export default function TeamPage() {
  return (
    <main className="pt-20">
      <section className="py-24 px-4 bg-neutral-950">
        <div className="mx-auto" style={{ maxWidth: "var(--container-xl)" }}>
          <h1
            className="text-center font-sans-header font-bold text-neutral-50 mb-16"
            style={{ fontSize: "var(--text-h1)", lineHeight: 1.2 }}
          >
            Our Team
          </h1>

          {/* TODO: Replace with TeamCard grid using actual data */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="glass-card p-6 text-center"
              >
                {/* Photo placeholder */}
                <div className="mx-auto mb-4 w-24 h-24 rounded-full bg-neutral-200 flex items-center justify-center">
                  <span
                    className="font-sans-header font-semibold text-neutral-600"
                    style={{ fontSize: "var(--text-h3)" }}
                  >
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>

                <h2
                  className="font-sans-header font-bold text-neutral-50"
                  style={{ fontSize: "var(--text-h4)" }}
                >
                  {member.name}
                </h2>
                <p
                  className="text-neutral-400 font-sans-body mt-1"
                  style={{ fontSize: "var(--text-small)" }}
                >
                  {member.title}
                </p>
                <p
                  className="text-neutral-200 font-sans-body mt-4"
                  style={{ fontSize: "var(--text-body)" }}
                >
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
