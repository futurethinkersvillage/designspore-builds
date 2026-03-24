"use client";

import { ArrowRight } from "@phosphor-icons/react";

export default function ContactForm() {
  const fields = [
    { id: "name", label: "Your Name", type: "text", placeholder: "Jane Smith" },
    { id: "phone-input", label: "Phone Number", type: "tel", placeholder: "(555) 000-0000" },
    { id: "email-input", label: "Email Address", type: "email", placeholder: "jane@email.com" },
    { id: "service", label: "Service Needed", type: "text", placeholder: "e.g. Drain cleaning, water heater" },
  ];

  return (
    <form className="grid sm:grid-cols-2 gap-4 text-left" onSubmit={(e) => e.preventDefault()}>
      {fields.map((field) => (
        <div key={field.id}>
          <label htmlFor={field.id} className="block text-white/50 text-xs mb-1.5 font-medium">
            {field.label}
          </label>
          <input
            id={field.id}
            type={field.type}
            placeholder={field.placeholder}
            className="w-full rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-colors"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
            onFocus={e => (e.target.style.borderColor = "var(--accent, #BE8C2A)")}
            onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
          />
        </div>
      ))}
      <div className="sm:col-span-2">
        <label htmlFor="message" className="block text-white/50 text-xs mb-1.5 font-medium">Message (optional)</label>
        <textarea
          id="message"
          rows={3}
          placeholder="Tell us about your project..."
          className="w-full rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-colors resize-none"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
          onFocus={e => (e.target.style.borderColor = "var(--accent, #BE8C2A)")}
          onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
        />
      </div>
      <div className="sm:col-span-2">
        <button type="submit" className="btn-primary w-full justify-center py-4 text-base flex items-center gap-2">
          Send Request <ArrowRight size={18} weight="bold" />
        </button>
      </div>
    </form>
  );
}
