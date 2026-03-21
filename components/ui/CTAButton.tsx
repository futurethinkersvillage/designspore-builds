import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";

type Variant = "primary" | "secondary" | "ghost";

interface CTAButtonProps {
  href: string;
  label: string;
  variant?: Variant;
  external?: boolean;
  arrow?: boolean;
  className?: string;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-forest text-cream hover:bg-forest-dark border border-forest hover:border-forest-dark",
  secondary:
    "bg-transparent text-ink border border-ink/20 hover:border-ink/50 hover:bg-cream-dark",
  ghost:
    "bg-transparent text-muted hover:text-ink border border-transparent",
};

export default function CTAButton({
  href,
  label,
  variant = "primary",
  external = false,
  arrow = false,
  className = "",
}: CTAButtonProps) {
  const classes = `inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-medium transition-all active:scale-[0.98] btn-fill ${variantStyles[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {label}
        {arrow && <ArrowRightIcon size={14} weight="bold" />}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {label}
      {arrow && <ArrowRightIcon size={14} weight="bold" />}
    </Link>
  );
}
