interface SectionDividerProps {
  variant?: "wave" | "straight";
  fromColor?: string;
  toColor?: string;
  flip?: boolean;
}

export default function SectionDivider({
  variant = "wave",
  fromColor = "var(--color-neutral-950)",
  toColor = "var(--color-neutral-900)",
  flip = false,
}: SectionDividerProps) {
  const path =
    variant === "wave"
      ? "M0,32 C320,96 640,0 960,48 C1280,96 1440,24 1440,24 L1440,96 L0,96 Z"
      : "M0,64 L1440,64 L1440,96 L0,96 Z";

  return (
    <div
      className="w-full overflow-hidden leading-none"
      style={{ transform: flip ? "scaleY(-1)" : undefined }}
      aria-hidden="true"
    >
      <svg
        className="w-full h-auto"
        viewBox="0 0 1440 96"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="1440" height="96" fill={fromColor} />
        <path d={path} fill={toColor} />
      </svg>
    </div>
  );
}
