import type { Metadata } from "next";
import { WordEntry } from "./WordEntry";
import { Sparkle, Campfire, Cube, Tree } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "moist — a gift from the forest floor",
  description:
    "You found a mushroom. There is a word on its stem. Solve its riddle and win a free night of camping at Wells Gray Resort — and an invitation to make art on the land.",
  robots: { index: false, follow: false },
};

export const revalidate = 60;

export default function MoistHub() {
  return (
    <main className="min-h-[100dvh] bg-warm-dark text-white">
      <section className="relative mx-auto max-w-3xl px-6 pt-32 pb-24 sm:pt-40">
        <p className="mb-6 text-xs font-medium uppercase tracking-[0.3em] text-amber">
          Otherworld · a gift
        </p>
        <h1 className="font-serif text-[clamp(3rem,12vw,6rem)] font-light italic leading-none tracking-tighter text-white">
          moist
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/70">
          You picked up a little mushroom. On the bottom of its stem there is a
          four-letter word. That word is a door.
        </p>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/70">
          Type it below to find its riddle. Solve the riddle and we&apos;ll send
          you a code for{" "}
          <span className="text-amber">a free night of camping</span> at Wells
          Gray Resort — on the edge of one of the wildest parks in British
          Columbia.
        </p>

        <div className="mt-10">
          <WordEntry />
          <p className="mt-3 text-sm text-white/40">
            No mushroom? That&apos;s alright — wander the festival. They like to
            hide.
          </p>
        </div>
      </section>

      <section className="border-t border-white/10 bg-black/20">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <h2 className="font-serif text-3xl font-light text-white sm:text-4xl">
            Why we&apos;re doing this
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-white/70">
            We&apos;re building a place near Wells Gray Park where people come to
            make things. We have a workshop with a 3D printer, a laser cutter, a
            full set of woodworking tools — and a CNC machine on the way.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-white/70">
            The free night isn&apos;t just a free night. It&apos;s an invitation.
            Come camp, and{" "}
            <span className="text-amber">make a piece of art</span> for the land —
            something that stays. A sculpture, a carving, a strange small
            creature for the forest floor. Every year we throw a party to tour the
            land and show off everything that&apos;s been made.
          </p>

          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            <li className="flex gap-3">
              <Sparkle weight="duotone" size={26} className="shrink-0 text-amber" />
              <div>
                <p className="font-medium text-white">Find the word</p>
                <p className="text-sm text-white/60">
                  Each mushroom carries a different riddle.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <Campfire weight="duotone" size={26} className="shrink-0 text-amber" />
              <div>
                <p className="font-medium text-white">Win a free night</p>
                <p className="text-sm text-white/60">
                  Solve it and we email your camping code.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <Cube weight="duotone" size={26} className="shrink-0 text-amber" />
              <div>
                <p className="font-medium text-white">Make something</p>
                <p className="text-sm text-white/60">
                  Use the printer, laser, CNC, and woodshop.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <Tree weight="duotone" size={26} className="shrink-0 text-amber" />
              <div>
                <p className="font-medium text-white">Leave it on the land</p>
                <p className="text-sm text-white/60">
                  Shown off at our annual art-tour party.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
