"use client";

import { useState, useTransition } from "react";
import { ArrowRightIcon } from "@phosphor-icons/react";

const services = [
  "AI Systems & Automation",
  "Website Design & Build",
  "Brand & Identity",
  "Media & Content Production",
  "Launch Strategy",
  "Fundraising Campaign",
  "Community & Events",
  "Something else",
];

export default function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      company: fd.get("company") as string,
      services: fd.getAll("services") as string[],
      message: fd.get("message") as string,
    };

    startTransition(async () => {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSent(true);
      } else {
        setError("Something went wrong — please email us directly at hello@designspore.co");
      }
    });
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] px-8 py-12 text-center">
        <p className="text-2xl font-bold text-white mb-2">Message sent.</p>
        <p className="text-white/50">We'll be in touch within one business day.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-xs uppercase tracking-widest text-white/40 font-semibold mb-2">Your Name</label>
          <input
            id="name" name="name" type="text" required
            placeholder="Jane Smith"
            className="w-full px-4 py-3 rounded-lg bg-raised border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-gold/60 transition-colors"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-xs uppercase tracking-widest text-white/40 font-semibold mb-2">Email</label>
          <input
            id="email" name="email" type="email" required
            placeholder="jane@company.com"
            className="w-full px-4 py-3 rounded-lg bg-raised border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-gold/60 transition-colors"
          />
        </div>
      </div>

      <div>
        <label htmlFor="company" className="block text-xs uppercase tracking-widest text-white/40 font-semibold mb-2">Company / Project</label>
        <input
          id="company" name="company" type="text"
          placeholder="What are you building?"
          className="w-full px-4 py-3 rounded-lg bg-raised border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-gold/60 transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-white/40 font-semibold mb-3">Service Type</label>
        <div className="flex flex-wrap gap-2">
          {services.map((s) => (
            <label key={s} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-raised cursor-pointer hover:border-gold/40 transition-colors text-sm text-white/60 hover:text-white">
              <input type="checkbox" name="services" value={s} className="accent-gold" />
              {s}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-xs uppercase tracking-widest text-white/40 font-semibold mb-2">Tell us about your project</label>
        <textarea
          id="message" name="message" rows={6} required
          placeholder="What are you building? What's the timeline? What does success look like?"
          className="w-full px-4 py-3 rounded-lg bg-raised border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-gold/60 transition-colors resize-none"
        />
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-3 px-8 py-4 rounded bg-gold text-dark font-bold text-lg tracking-wide hover:bg-gold-light btn-press w-full sm:w-auto justify-center disabled:opacity-50"
      >
        {isPending ? "Sending…" : <><span>Send Message</span><ArrowRightIcon size={18} weight="bold" /></>}
      </button>
    </form>
  );
}
