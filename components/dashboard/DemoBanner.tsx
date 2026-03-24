export default function DemoBanner() {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gold/10 border-b border-gold/20 text-xs">
      <span className="text-gold font-semibold">
        Demo mode — you're viewing the portal as a sample client
      </span>
      <a
        href="/api/demo/exit"
        className="text-gold/60 hover:text-gold underline transition-colors"
      >
        Exit demo
      </a>
    </div>
  );
}
