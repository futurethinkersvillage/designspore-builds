"use client";

import { useState } from "react";
import { ArrowRight, Check, CheckCircle, Warning } from "@phosphor-icons/react";

export const HOW_KNOW_OPTIONS = [
  { value: "friend_family", label: "Friend of Mike and Euvie / the Gilliland family" },
  { value: "family", label: "Family" },
  { value: "business_associate", label: "Business associate or colleague" },
  { value: "past_guest", label: "Past guest at Wells Gray Golf & RV Resort" },
  { value: "podcast_listener", label: "Future Thinkers podcast listener" },
  { value: "mailing_list", label: "Future Thinkers mailing list" },
  { value: "group_online", label: "Saw it in a group or online community" },
  { value: "referred", label: "Referred by a current member or a friend" },
] as const;

const NEEDS_DETAIL = ["podcast_listener", "mailing_list", "group_online", "referred", "business_associate"];

const JOINING_AS_OPTIONS = [
  "Family with kids",
  "Multigenerational family (kids + grandparents)",
  "Couple",
  "Retired couple",
  "Younger couple",
  "Single",
];

const TIER_OPTIONS = [
  { value: "cabin_max", label: "Founder Cabin Max — 2 free weeks/season in a cabin, deepest benefits" },
  { value: "cabin", label: "Founder Cabin — 1 free week/season in a cabin (sleeps four)" },
  { value: "rv", label: "Founder RV — 2 free weeks/season on a serviced RV site" },
  { value: "public_waitlist", label: "Public membership (no equity) — join the waitlist" },
  { value: "not_sure", label: "Not sure yet — help me choose" },
];

const COMMUNITY_FIT_OPTIONS = [
  { value: "yes", label: "Yes — that's exactly what appeals to me" },
  { value: "mostly", label: "Mostly — I have a couple of questions" },
  { value: "not_quite", label: "Not quite — I'm looking for something different" },
];

const TIMELINE_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "probably", label: "Probably — I'd want to see the full details first" },
  { value: "just_exploring", label: "Just exploring for now" },
];

type FormData = {
  name: string; email: string; phone: string; location: string;
  joining_as: string; how_know_us: string; how_know_us_detail: string;
  tier_interest: string; what_interests_you: string;
  community_fit: string; timeline: string; anything_else: string;
  consent: boolean;
};

const EMPTY: FormData = {
  name: "", email: "", phone: "", location: "", joining_as: "",
  how_know_us: "", how_know_us_detail: "", tier_interest: "",
  what_interests_you: "", community_fit: "", timeline: "",
  anything_else: "", consent: false,
};

export type MembershipFormTheme = "dark" | "warm" | "light";

interface Props {
  theme?: MembershipFormTheme;
  ctaLabel?: string;
  successTitle?: string;
  successBody?: (name: string, autoApproved: boolean) => string;
}

function RadioGroup({
  options, value, onChange, theme = "dark",
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  theme?: MembershipFormTheme;
}) {
  const active = theme === "light"
    ? "border-amber bg-amber/10 text-gray-900"
    : theme === "warm"
    ? "border-amber bg-amber/15 text-white"
    : "border-amber bg-amber/10 text-white";
  const inactive = theme === "light"
    ? "border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700"
    : "border-white/10 text-white/50 hover:border-white/30 hover:text-white/70";

  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <label key={opt.value}
          className={`flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-all ${value === opt.value ? active : inactive}`}
        >
          <input type="radio" value={opt.value} checked={value === opt.value}
            onChange={() => onChange(opt.value)} className="sr-only" />
          <span className={`w-4 h-4 rounded-full border shrink-0 flex items-center justify-center transition-all ${
            value === opt.value ? "border-amber bg-amber" : theme === "light" ? "border-gray-300" : "border-white/25"
          }`}>
            {value === opt.value && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
          </span>
          <span className="text-sm">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

export function MembershipInquiryForm({ theme = "dark", ctaLabel = "Send my inquiry", successTitle, successBody }: Props) {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [autoApproved, setAutoApproved] = useState(false);

  const set = (k: keyof FormData, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));
  const needsDetail = NEEDS_DETAIL.includes(form.how_know_us);

  const inputCls = theme === "light"
    ? "w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-amber/70 transition-colors"
    : theme === "warm"
    ? "w-full bg-amber/5 border border-amber/20 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-amber/60 transition-colors"
    : "w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-amber/60 transition-colors";

  const labelCls = theme === "light"
    ? "block text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400 mb-2"
    : "block text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35 mb-2";

  const checkBorder = theme === "light" ? "border-gray-300" : "border-white/25";
  const legalCls = theme === "light" ? "text-gray-400" : "text-white/25";
  const errorCls = theme === "light" ? "text-red-600" : "text-red-400";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/membership-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setAutoApproved(data.score === "GREEN");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    const firstName = form.name.split(" ")[0];
    const defaultBody = autoApproved
      ? `Thanks, ${firstName}. We've sent the Founders brief to your inbox — check it now. Founding spots are confirmed in the order deposits arrive.`
      : `Thanks, ${firstName}. We'll review your inquiry and be in touch. If it's a fit, you'll receive the full brief and how to hold your spot.`;
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle size={36} weight="fill" className="text-amber mb-5" />
        <h3 className={`font-serif text-2xl font-light mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
          {successTitle ?? (autoApproved ? "Check your inbox." : "Inquiry received.")}
        </h3>
        <p className={`text-sm leading-relaxed max-w-md ${theme === "light" ? "text-gray-500" : "text-white/50"}`}>
          {successBody ? successBody(firstName, autoApproved) : defaultBody}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-9">
      {/* About you */}
      <fieldset>
        <legend className={`${labelCls} mb-5 text-amber/70`}>About you</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Full name *</label>
            <input required className={inputCls} placeholder="Jane Smith" value={form.name} onChange={e => set("name", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Email *</label>
            <input required type="email" className={inputCls} placeholder="jane@example.com" value={form.email} onChange={e => set("email", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Phone (optional)</label>
            <input className={inputCls} placeholder="+1 (250) 555-0100" value={form.phone} onChange={e => set("phone", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Where are you based? *</label>
            <input required className={inputCls} placeholder="City, Province / State" value={form.location} onChange={e => set("location", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Who would be joining? *</label>
            <select required value={form.joining_as} onChange={e => set("joining_as", e.target.value)} className={inputCls + " cursor-pointer"}>
              <option value="">Select…</option>
              {JOINING_AS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
      </fieldset>

      {/* Connection */}
      <fieldset>
        <legend className={`${labelCls} mb-5 text-amber/70`}>Your connection</legend>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>How do you know us? *</label>
            <select required value={form.how_know_us} onChange={e => { set("how_know_us", e.target.value); set("how_know_us_detail", ""); }} className={inputCls + " cursor-pointer"}>
              <option value="">Select…</option>
              {HOW_KNOW_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          {needsDetail && (
            <div>
              <label className={labelCls}>Tell us more *</label>
              <textarea required rows={3} className={inputCls + " resize-none"} placeholder="Who referred you, which group you saw it in, or how we know each other — a sentence or two is perfect." value={form.how_know_us_detail} onChange={e => set("how_know_us_detail", e.target.value)} />
            </div>
          )}
        </div>
      </fieldset>

      {/* Interest */}
      <fieldset>
        <legend className={`${labelCls} mb-5 text-amber/70`}>Your interest</legend>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Which membership interests you? *</label>
            <select required value={form.tier_interest} onChange={e => set("tier_interest", e.target.value)} className={inputCls + " cursor-pointer"}>
              <option value="">Select…</option>
              {TIER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>What interests you about Wells Gray Village? *</label>
            <textarea required rows={4} className={inputCls + " resize-none"} placeholder="No wrong answers — we'd just like to hear it in your words." value={form.what_interests_you} onChange={e => set("what_interests_you", e.target.value)} />
          </div>
        </div>
      </fieldset>

      {/* Values & timing */}
      <fieldset>
        <legend className={`${labelCls} mb-5 text-amber/70`}>Values &amp; timing</legend>
        <div className="space-y-6">
          <div>
            <label className={`${labelCls} mb-3 normal-case tracking-normal text-xs`}>
              Wells Gray Village is a professionally run resort community with clear house rules and a friendly, respectful atmosphere. Does that sound like the place you&apos;re looking for? *
            </label>
            <RadioGroup options={COMMUNITY_FIT_OPTIONS} value={form.community_fit} onChange={v => set("community_fit", v)} theme={theme} />
          </div>
          <div>
            <label className={`${labelCls} mb-3 normal-case tracking-normal text-xs`}>
              Founding spots are held with a fully refundable $2,000 deposit. If it&apos;s a fit, are you in a position to move forward this season? *
            </label>
            <RadioGroup options={TIMELINE_OPTIONS} value={form.timeline} onChange={v => set("timeline", v)} theme={theme} />
          </div>
        </div>
      </fieldset>

      {/* Anything else */}
      <div>
        <label className={labelCls}>Anything else? (optional)</label>
        <textarea rows={3} className={inputCls + " resize-none"} placeholder="Questions, context, or anything you'd like to share." value={form.anything_else} onChange={e => set("anything_else", e.target.value)} />
      </div>

      {/* Consent + submit */}
      <div className="space-y-5">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className={`mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-all ${form.consent ? "border-amber bg-amber" : `${checkBorder} group-hover:border-amber/50`}`}>
            {form.consent && <Check size={10} weight="bold" className="text-white" />}
          </div>
          <input type="checkbox" required checked={form.consent} onChange={e => set("consent", e.target.checked)} className="sr-only" />
          <span className={`text-xs leading-relaxed ${legalCls}`}>
            I understand this is an inquiry, not an offer of membership or securities, and I&apos;m happy for Mike &amp; Euvie to contact me.
          </span>
        </label>

        {status === "error" && (
          <p className={`flex items-center gap-2 text-sm ${errorCls}`}>
            <Warning size={14} weight="bold" />
            Something went wrong. Email us at{" "}
            <a href="mailto:contact@futurethinkers.org" className="underline">contact@futurethinkers.org</a>
          </p>
        )}

        <button type="submit" disabled={status === "sending"}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-amber px-10 py-4 text-sm font-medium text-white transition-all hover:bg-amber/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "sending" ? "Sending…" : <>{ctaLabel} <ArrowRight size={13} weight="bold" /></>}
        </button>
      </div>

      <p className={`text-[11px] leading-relaxed ${legalCls}`}>
        This form is an inquiry, not an offer of membership or securities. A Founding Membership includes non-voting shares in Portal.Place Inc., offered under applicable private-placement exemptions. Full terms and risk disclosures are in the formal subscription documents. Amounts in CAD.
      </p>
    </form>
  );
}
