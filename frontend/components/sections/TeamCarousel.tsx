"use client";

import GlassCard from "@/components/ui/GlassCard";
import Image from "next/image";
import { useRef } from "react";

interface TeamMember {
  name: string;
  title: string;
  bio: string;
  photo?: string;
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
      className="py-24 px-4 bg-bg-subtle"
      aria-label="Leadership team"
    >
      <div className="mx-auto" style={{ maxWidth: "var(--container-xl)" }}>
        <h2 className="text-center font-serif font-semibold text-fg mb-2 text-h2">
          Board of Directors
        </h2>

        <h4 className="text-center font-body text-fg-muted mb-12 tect body">
          Navigating the Energy sector with over 100 years of collective industry insight.
        </h4>

        <div className="relative">
          {/* Scroll controls (desktop) */}
          {showControls && (
            <>
              <button
                onClick={() => scroll("left")}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 glass-card-dark w-11 h-11 items-center justify-center rounded-full text-fg-muted hover:text-fg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-label="Scroll left"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M10 12L6 8l4-4" />
                </svg>
              </button>
              <button
                onClick={() => scroll("right")}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 glass-card-dark w-11 h-11 items-center justify-center rounded-full text-fg-muted hover:text-fg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-label="Scroll right"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M6 4l4 4-4 4" />
                </svg>
              </button>
            </>
          )}

          {/* Card container */}
          <div
            ref={scrollRef}
            className={`flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none py-4 -my-4 ${!showControls ? "justify-center" : ""
              }`}
            style={{ scrollbarWidth: "none", overscrollBehaviorX: "contain" }}
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
                      <Image
                        src={member.photo}
                        alt={member.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-palette-neutral-200 flex items-center justify-center">
                        <span className="font-sans font-semibold text-palette-neutral-600 text-h3">
                          {getInitials(member.name)}
                        </span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-center font-sans font-bold text-fg text-h4">
                    {member.name}
                  </h3>
                  <p className="text-center text-fg-muted font-body mt-1 text-small">
                    {member.title}
                  </p>
                  <p className="text-center text-fg-secondary font-body mt-3 text-small">
                    {member.bio}
                  </p>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section >
  );
}
