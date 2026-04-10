import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-warm-dark px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-amber mb-6">404</p>
      <h1 className="font-serif text-[clamp(2.5rem,8vw,5rem)] font-light leading-[0.95] tracking-tighter text-white mb-6">
        You wandered<br />
        <span className="italic">off the trail.</span>
      </h1>
      <p className="text-base text-white/50 max-w-[40ch] mb-10">
        This page doesn&apos;t exist — but the village does. Head back and explore.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-amber px-7 py-3.5 text-sm font-medium text-white transition-all hover:bg-amber/90 active:scale-[0.98]"
        >
          Back home <ArrowRight size={14} weight="bold" />
        </Link>
        <Link
          href="/village"
          className="inline-flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-white"
        >
          Explore the village <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
