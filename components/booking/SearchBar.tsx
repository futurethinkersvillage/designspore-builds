'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

function today(offset = 0) {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toISOString().slice(0, 10)
}

/**
 * The site's primary action. Lives *inside* the hero so the land sells the
 * place and the search takes the booking without either feeling bolted on.
 * `variant="bar"` is the compact version for interior pages.
 */
export default function SearchBar({ variant = 'hero' }: { variant?: 'hero' | 'bar' }) {
  const router = useRouter()
  const [from, setFrom] = useState(today(1))
  const [to, setTo] = useState(today(3))
  const [guests, setGuests] = useState(2)

  const invalid = !from || !to || to <= from

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (invalid) return
    router.push(`/book?from=${from}&to=${to}&guests=${guests}`)
  }

  const hero = variant === 'hero'

  return (
    <form
      onSubmit={submit}
      className={
        hero
          ? 'w-full max-w-3xl bg-bark/70 backdrop-blur-md border border-parchment/15 rounded-lg p-3 md:p-4 shadow-2xl'
          : 'w-full bg-bark border border-border rounded-lg p-3'
      }
    >
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-end">
        <Field label="Arrive" className="flex-1">
          <input
            type="date"
            value={from}
            min={today()}
            onChange={e => setFrom(e.target.value)}
            className="w-full bg-transparent text-parchment font-body text-sm outline-none
                       [color-scheme:dark]"
          />
        </Field>

        <Field label="Depart" className="flex-1">
          <input
            type="date"
            value={to}
            min={from || today(1)}
            onChange={e => setTo(e.target.value)}
            className="w-full bg-transparent text-parchment font-body text-sm outline-none
                       [color-scheme:dark]"
          />
        </Field>

        <Field label="Guests" className="sm:w-28">
          <select
            value={guests}
            onChange={e => setGuests(Number(e.target.value))}
            className="w-full bg-transparent text-parchment font-body text-sm outline-none"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
              <option key={n} value={n} className="bg-bark text-parchment">
                {n} {n === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </Field>

        <button
          type="submit"
          disabled={invalid}
          className="btn-ember justify-center sm:w-auto disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Check availability
        </button>
      </div>

      {invalid && (
        <p className="text-ember text-xs mt-2 px-1">Departure must be after arrival.</p>
      )}
    </form>
  )
}

function Field({
  label, children, className = '',
}: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block bg-bark/50 border border-parchment/10 rounded px-3 py-2 ${className}`}>
      <span className="block font-body text-[10px] uppercase tracking-[0.15em] text-parchment/50 mb-1">
        {label}
      </span>
      {children}
    </label>
  )
}
