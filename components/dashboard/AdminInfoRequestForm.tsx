"use client";

import { useState, useTransition } from "react";
import { createClientInfoRequest } from "@/app/actions/requests";
import { useRouter } from "next/navigation";

export default function AdminInfoRequestForm({
  clients,
}: {
  clients: { id: string; name: string | null; email: string | null }[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await createClientInfoRequest({ userId, message });
      if (result.success) {
        setSent(true);
        setMessage("");
        setUserId("");
        setTimeout(() => { setSent(false); setOpen(false); }, 2000);
        router.refresh();
      }
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 border border-gold/30 text-gold text-xs font-semibold rounded-lg hover:bg-gold/[0.06] transition-colors"
      >
        + Request info from client
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-raised border border-white/[0.06] rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">Request Info from Client</p>
        <button type="button" onClick={() => setOpen(false)} className="text-white/30 hover:text-white text-lg leading-none">×</button>
      </div>
      <select
        required
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="w-full bg-dark border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold/30 transition-colors"
      >
        <option value="">Select client…</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>{c.name ?? c.email}</option>
        ))}
      </select>
      <textarea
        required
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        placeholder="What do you need from them? (e.g. 'We need your hosting login to proceed with the chatbot setup')"
        className="w-full bg-dark border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold/30 resize-none transition-colors"
      />
      <button
        type="submit"
        disabled={isPending || !userId || !message.trim()}
        className="px-4 py-2 bg-gold text-dark text-xs font-semibold rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50"
      >
        {isPending ? "Sending…" : sent ? "Sent ✓" : "Send Request"}
      </button>
    </form>
  );
}
