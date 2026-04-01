interface GlassCardProps {
  variant?: "default" | "subtle";
  elevated?: boolean;
  hoverable?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
  children: React.ReactNode;
  className?: string;
}

export default function GlassCard({
  variant = "default",
  elevated = false,
  hoverable = false,
  as: Tag = "div",
  children,
  className = "",
}: GlassCardProps) {
  const baseClass = variant === "subtle" ? "glass-card-subtle" : "glass-card";
  const elevatedClass = elevated ? "glass-elevated" : "";
  const hoverClass = hoverable
    ? "transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-lg"
    : "";

  return (
    <Tag
      className={`${baseClass} ${elevatedClass} ${hoverClass} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${className}`}
    >
      {children}
    </Tag>
  );
}
