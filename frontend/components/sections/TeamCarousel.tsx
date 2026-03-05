"use client";

import { useRef } from "react";
import GlassCard from "@/components/ui/GlassCard";

interface TeamMember {
  name: string;
  title: string;
  bio: string;
  photo?: string;
  linkedIn?: string;
}

interface TeamCarouselProps {
  members: TeamMember[];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function TeamCarousel({ members }: TeamCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 320;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (members.length === 0) return null;

  const showControls = members.length > 2;

  return (
    <section
      className="py-24 px-4 bg-neutral-950"
      aria-label="Leadership team"
    >
      <div className="mx-auto" style={{ maxWidth: "var(--container-xl)" }}>
        <h2
          className="text-center font-sans-header font-semibold text-neutral-50 mb-16"
          style={{ fontSize: "var(--text-h2)" }}
        >
          Leadership
        </h2>

        <div className="relative">
          {/* Scroll controls (desktop) */}
          {showControls && (
            <>
              <button
                onClick={() => scroll("left")}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 glass-card-dark w-10 h-10 items-center justify-center rounded-full"
                aria-label="Scroll left"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 12L6 8l4-4" />
                </svg>
              </button>
              <button
                onClick={() => scroll("right")}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 glass-card-dark w-10 h-10 items-center justify-center rounded-full"
                aria-label="Scroll right"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 4l4 4-4 4" />
                </svg>
              </button>
            </>
          )}

          {/* Card container */}
          <div
            ref={scrollRef}
            className={`flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none ${
              !showControls ? "justify-center" : ""
            }`}
            style={{ scrollbarWidth: "none" }}
          >
            {members.map((member) => (
              <div
                key={member.name}
                className="snap-start shrink-0 w-72"
              >
                <GlassCard variant="light" hoverable className="p-6 h-full">
                  {/* Photo or initials */}
                  <div className="mx-auto mb-4 w-20 h-20 rounded-full overflow-hidden">
                    {member.photo ? (
                      // TODO: Replace with Next.js <Image>
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
                        <span
                          className="font-sans-header font-semibold text-neutral-600"
                          style={{ fontSize: "var(--text-h3)" }}
                        >
                          {getInitials(member.name)}
                        </span>
                      </div>
                    )}
                  </div>

                  <h3
                    className="text-center font-sans-header font-bold text-neutral-50"
                    style={{ fontSize: "var(--text-h4)" }}
                  >
                    {member.name}
                  </h3>
                  <p
                    className="text-center text-neutral-400 font-sans-body mt-1"
                    style={{ fontSize: "var(--text-small)" }}
                  >
                    {member.title}
                  </p>
                  <p
                    className="text-center text-neutral-200 font-sans-body mt-3"
                    style={{ fontSize: "var(--text-small)" }}
                  >
                    {member.bio}
                  </p>

                  {member.linkedIn && (
                    <a
                      href={member.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center mt-4 text-teal-blue hover:text-sky-reflection transition-colors font-sans-body"
                      style={{ fontSize: "var(--text-small)" }}
                    >
                      LinkedIn &rarr;
                    </a>
                  )}
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
