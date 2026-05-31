import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { getPublicPuzzle, normalizeWord } from "@/lib/puzzles";
import { SolveForm } from "./SolveForm";

export const revalidate = 60;
export const dynamicParams = true;

type Params = { params: Promise<{ word: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { word } = await params;
  const puzzle = await getPublicPuzzle(word);
  return {
    title: puzzle ? `${puzzle.title} — Otherworld` : "Otherworld",
    description: puzzle?.riddle?.slice(0, 150) ?? "A riddle from the forest floor.",
    robots: { index: false, follow: false },
  };
}

export default async function PuzzlePage({ params }: Params) {
  const { word } = await params;
  const slug = normalizeWord(word);
  const puzzle = await getPublicPuzzle(slug);

  if (!puzzle) {
    return (
      <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-warm-dark px-6 text-center text-white">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-amber">
          Otherworld · a gift
        </p>
        <h1 className="mt-6 font-serif text-4xl font-light italic text-white">
          No riddle by that name
        </h1>
        <p className="mt-4 max-w-md text-white/60">
          The word{" "}
          <span className="font-mono uppercase tracking-widest text-white">
            {slug || "—"}
          </span>{" "}
          doesn&apos;t open any door we know. Check the spelling on your
          mushroom&apos;s stem.
        </p>
        <Link
          href="/otherworld"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm text-white transition hover:border-amber hover:text-amber"
        >
          <ArrowLeft size={16} /> Try another word
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-warm-dark text-white">
      <div className="mx-auto max-w-2xl px-6 pt-28 pb-24 sm:pt-36">
        <Link
          href="/otherworld"
          className="inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-amber"
        >
          <ArrowLeft size={15} /> Otherworld
        </Link>

        <p className="mt-10 font-mono text-sm uppercase tracking-[0.4em] text-amber">
          {puzzle.word}
        </p>
        <h1 className="mt-3 font-serif text-[clamp(2.25rem,7vw,4rem)] font-light leading-[1.05] tracking-tight text-white">
          {puzzle.title}
        </h1>

        <div className="mt-10 rounded-2xl border border-white/10 bg-black/20 p-8">
          <p className="whitespace-pre-line font-serif text-xl leading-relaxed text-white/90">
            {puzzle.riddle}
          </p>
        </div>

        <p className="mt-6 text-sm text-white/50">
          Solve it to win <span className="text-amber">{puzzle.reward}</span>.
          We&apos;ll email your code.
        </p>

        <div className="mt-8">
          <SolveForm word={puzzle.word} hints={puzzle.hints} />
        </div>
      </div>
    </main>
  );
}
