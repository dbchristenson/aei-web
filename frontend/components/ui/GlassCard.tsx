interface GlassCardProps {
  variant?: "light" | "dark";
  hoverable?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
  children: React.ReactNode;
  className?: string;
}

export default function GlassCard({
  variant = "light",
  hoverable = false,
  as: Tag = "div",
  children,
  className = "",
}: GlassCardProps) {
  const baseClass = variant === "dark" ? "glass-card-dark" : "glass-card";
  const hoverClass = hoverable
    ? "transition-transform hover:-translate-y-1 hover:shadow-lg"
    : "";

  return (
    <Tag
      className={`${baseClass} ${hoverClass} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-blue ${className}`}
    >
      {children}
    </Tag>
  );
}
