import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary: "bg-sage-dark text-cream hover:bg-sidebar",
  secondary: "bg-sage-light text-sidebar hover:bg-sage hover:text-cream",
  ghost: "text-ink-muted hover:bg-border/60 hover:text-ink",
};

const Button = ({
  loading = false,
  variant = "primary",
  className = "",
  children,
  disabled,
  ...props
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;