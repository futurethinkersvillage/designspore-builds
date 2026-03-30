'use client'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 px-6 py-2 border border-parchment/40 text-parchment font-body font-medium text-xs rounded transition-all duration-300 hover:border-parchment hover:bg-parchment/10"
    >
      Export PDF
    </button>
  )
}
