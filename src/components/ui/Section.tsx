interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: "white" | "cream" | "dark";
}

const bgStyles = {
  white: "bg-white text-dark",
  cream: "bg-cream text-dark",
  dark: "bg-dark text-white",
};

export function Section({
  children,
  className = "",
  id,
  background = "white",
}: SectionProps) {
  return (
    <section id={id} className={`py-16 md:py-24 ${bgStyles[background]} ${className}`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">{children}</div>
    </section>
  );
}
