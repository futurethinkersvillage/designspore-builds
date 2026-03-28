const styles: Record<string, string> = {
  pending:   "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
  active:    "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  completed: "bg-white/[0.06] text-white/40 border-white/[0.08]",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function ModuleStatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border capitalize ${styles[status] ?? styles.pending}`}>
      {status}
    </span>
  );
}
