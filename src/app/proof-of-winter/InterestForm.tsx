"use client";

import { useState } from "react";

// Reuses /api/contact (Resend → Mike's inbox). Interest only: this is not an application or a donation form.
export function InterestForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const fd = new FormData(e.currentTarget);
    const role = fd.get("role") || "Something else";
    const body = {
      name: fd.get("name"),
      email: fd.get("email"),
      subject: `Proof of Winter: ${role}`,
      message: `${role}\n\n${fd.get("message") || "(no message)"}`,
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-8">
        <p className="font-serif text-3xl text-white">Thank you.</p>
        <p className="mt-3 text-[16px] leading-relaxed text-white/70">Mike and Euvie read every one of these and will write back.</p>
      </div>
    );
  }

  const input =
    "w-full rounded-lg border border-white/15 bg-white/[0.06] px-4 py-3 text-[16px] text-white placeholder:text-white/40 focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber/40";
  const option = "bg-[#1A1720] text-white";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" required aria-label="Your name" placeholder="Your name" className={input} autoComplete="name" />
        <input name="email" required type="email" aria-label="Email" placeholder="Email" className={input} autoComplete="email" />
      </div>
      <select name="role" aria-label="What brings you here" defaultValue="" required className={input}>
        <option value="" disabled className={option}>What brings you here?</option>
        <option className={option}>I might fund this: let's talk</option>
        <option className={option}>I'd enter a prize: tell me when rules are ready</option>
        <option className={option}>I'd help write the rules or judge</option>
        <option className={option}>My company might sponsor tools or a class</option>
        <option className={option}>I've lost work or can't get in: tell me about The Relaunch</option>
        <option className={option}>You've got something wrong, and here's what</option>
      </select>
      <textarea name="message" rows={4} aria-label="Message" placeholder="What would you enter, change or want to know? (optional)" className={input} />
      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex w-full items-center justify-center rounded-full bg-amber px-8 py-4 text-[15px] font-medium text-white transition hover:bg-amber/90 disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? "Sending…" : "Send"}
      </button>
      {status === "error" && (
        <p className="text-sm text-amber">
          That didn&apos;t send. Please email{" "}
          <a className="underline" href="mailto:mike@futurethinkers.org">mike@futurethinkers.org</a>.
        </p>
      )}
    </form>
  );
}
