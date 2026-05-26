"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, Warning, Lock, ArrowRight } from "@phosphor-icons/react";
import { motion } from "framer-motion";

/* ── Address data ─────────────────────────────────────────────────── */

const CHAINS = [
  {
    id: "btc",
    symbol: "BTC",
    label: "Bitcoin",
    network: "Bitcoin network",
    address: "Bc1qsmt2cf287nry9jt3sd5q9nd2am668hyr26f34q",
  },
  {
    id: "evm",
    symbol: "ETH · USDC · USDT",
    label: "Ethereum & EVM tokens",
    network: "Ethereum mainnet — ERC-20 / ERC-20 compatible",
    address: "0x4C033739db126C2868Cad60b750d4F5Eb7f204a8",
  },
] as const;

/* ── Single address card ──────────────────────────────────────────── */

function AddressCard({ chain }: { chain: (typeof CHAINS)[number] }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(chain.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for browsers without clipboard API
      const el = document.createElement("textarea");
      el.value = chain.address;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [chain.address]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45 }}
      className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 lg:p-8"
    >
      {/* Header row */}
      <div className="flex items-center gap-3 mb-5">
        <span className="rounded-full border border-amber/30 bg-amber/[0.08] px-3 py-1 text-[11px] font-bold tracking-[0.12em] text-amber">
          {chain.symbol}
        </span>
        <span className="text-sm font-medium text-white">{chain.label}</span>
        <span className="hidden sm:block text-[11px] text-white/35 font-mono">
          · {chain.network}
        </span>
      </div>

      {/* QR + address grid */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-7">
        {/* QR code — white card for max scannability */}
        <div
          className="shrink-0 self-start rounded-xl bg-white p-3 shadow-sm"
          role="img"
          aria-label={`QR code for ${chain.label} address ${chain.address}`}
        >
          <QRCodeSVG
            value={chain.address}
            size={128}
            bgColor="#ffffff"
            fgColor="#1a1817"
            level="M"
          />
        </div>

        {/* Full address + copy */}
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40 mb-2">
            Full address
          </p>
          <p className="font-mono text-[13px] leading-[1.7] text-white/90 break-all select-all">
            {chain.address}
          </p>
          <button
            onClick={handleCopy}
            className={`
              mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium
              border transition-all duration-200 active:scale-[0.97]
              ${copied
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                : "border-white/15 bg-white/[0.05] text-white/60 hover:border-white/30 hover:text-white"
              }
            `}
          >
            {copied ? (
              <><Check size={13} weight="bold" /> Address copied</>
            ) : (
              <><Copy size={13} weight="light" /> Copy address</>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main exported component ──────────────────────────────────────── */

interface CryptoContributeProps {
  /**
   * Pass the full /partner URL with anchor if rendering outside /partner.
   * Defaults to "#access" (works fine when rendered on /partner itself).
   */
  investHref?: string;
}

export function CryptoContribute({ investHref = "#access" }: CryptoContributeProps) {
  return (
    <section className="bg-warm-dark py-20 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-16">

        {/* Section heading */}
        <div className="mb-12 lg:mb-16 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_44%]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber mb-4">
              Donate to the Future Thinkers Foundation
            </p>
            <h2 className="font-serif text-4xl font-light text-white sm:text-5xl lg:text-6xl">
              Support the mission<br />
              <span className="italic">with crypto.</span>
            </h2>
          </div>
          <div className="flex items-end">
            <p className="text-sm leading-relaxed text-white/55 max-w-[48ch]">
              The Future Thinkers Foundation is our non-profit arm supporting
              education, research, and community development around Smart Village
              principles. Crypto donations go directly to the Foundation&apos;s
              mission — not to the for-profit entities.
            </p>
          </div>
        </div>

        {/* Address cards */}
        <div className="space-y-4 lg:space-y-5 mb-8">
          {CHAINS.map((chain) => (
            <AddressCard key={chain.id} chain={chain} />
          ))}
        </div>

        {/* Verification warning */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.4 }}
          className="flex items-start gap-3 rounded-xl border border-amber/20 bg-amber/[0.05] px-5 py-4"
        >
          <Warning size={16} weight="fill" className="text-amber shrink-0 mt-0.5" />
          <p className="text-sm leading-relaxed text-white/70">
            <span className="font-medium text-white">Always confirm the address on this page before sending.</span>{" "}
            Crypto transfers are irreversible — double-check the full address before
            broadcasting any transaction.
          </p>
        </motion.div>

        {/* Divider + invest CTA */}
        <div className="mt-16 pt-12 border-t border-white/[0.08]">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                <Lock size={14} weight="light" className="text-white/50" />
              </div>
              <div className="max-w-[48ch]">
                <p className="text-sm font-medium text-white mb-1">
                  Looking to invest, not donate?
                </p>
                <p className="text-sm leading-relaxed text-white/50">
                  Equity investment in Portal.Place goes through a formal process —
                  NDA, review of offering documents, and a structured agreement.
                  Crypto addresses above are for Foundation donations only.
                </p>
              </div>
            </div>
            <div className="shrink-0 sm:pl-8">
              <Link
                href={investHref}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white/80 transition-colors hover:border-white/50 hover:text-white"
              >
                Request investor access <ArrowRight size={13} weight="bold" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
