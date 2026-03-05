import Link from "next/link";

interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

const sizeClasses: Record<string, string> = {
  sm: "px-4 py-2 text-sm rounded-[var(--radius-button)]",
  md: "px-6 py-3 text-base rounded-[var(--radius-button)]",
  lg: "px-8 py-4 text-lg rounded-[var(--radius-button)]",
};

const variantClasses: Record<string, string> = {
  primary:
    "bg-teal-blue text-white hover:bg-primary-hover hover:-translate-y-0.5 transition-all",
  secondary:
    "bg-transparent text-teal-blue border border-teal-blue hover:bg-teal-blue/10 transition-all",
  ghost:
    "bg-transparent text-neutral-400 hover:text-neutral-50 transition-colors",
};

export default function Button({
  variant = "primary",
  size = "md",
  href,
  disabled = false,
  loading = false,
  children,
  onClick,
  type = "button",
  className = "",
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center font-sans-body font-medium
    ${variantClasses[variant]} ${sizeClasses[size]}
    ${disabled || loading ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-blue
    ${className}`.trim();

  const content = loading ? (
    <svg
      className="animate-spin h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Loading"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  ) : (
    children
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {content}
    </button>
  );
}
