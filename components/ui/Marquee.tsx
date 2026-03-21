interface Props {
  items: string[];
  separator?: string;
  className?: string;
}

export default function Marquee({ items, separator = "·", className = "" }: Props) {
  // Duplicate items so the marquee loops seamlessly
  const doubled = [...items, ...items];

  return (
    <div className={`marquee-wrap ${className}`} aria-hidden="true">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-8 px-8 text-white/25 font-semibold text-xs uppercase tracking-widest whitespace-nowrap select-none">
            {item}
            <span className="text-gold/40">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
