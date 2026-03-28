"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowRight, ArrowLeft, X } from "@phosphor-icons/react";
import type { TourStep } from "@/lib/demo-config";

interface Props {
  steps: TourStep[];
  portalDemoUrl?: string;
  bookingUrl: string;
}

interface ViewportRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PADDING = 14;
const TOOLTIP_WIDTH = 320;

export default function GuidedTour({ steps, portalDemoUrl, bookingUrl }: Props) {
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<ViewportRect | null>(null);
  const scrollDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isScrollingRef = useRef(false);

  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  // Measure target using viewport coordinates directly from getBoundingClientRect.
  // No page-coordinate math — avoids race conditions with smooth scroll.
  const measureTarget = useCallback(() => {
    if (!currentStep) return;
    const el = document.querySelector(currentStep.target);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setTargetRect({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });
  }, [currentStep]);

  // Scroll element into view, then wait for scroll to settle before measuring.
  const scrollAndMeasure = useCallback(() => {
    if (!currentStep) return;
    const el = document.querySelector(currentStep.target);
    if (!el) return;

    isScrollingRef.current = true;
    el.scrollIntoView({ behavior: "smooth", block: "center" });

    // Poll until scroll stops, then measure. Covers variable scroll durations.
    let stable = 0;
    let last = window.scrollY;
    const poll = setInterval(() => {
      const cur = window.scrollY;
      if (Math.abs(cur - last) < 1) {
        stable++;
        if (stable >= 3) {
          clearInterval(poll);
          isScrollingRef.current = false;
          measureTarget();
        }
      } else {
        stable = 0;
      }
      last = cur;
    }, 50);

    // Safety fallback after 800ms
    setTimeout(() => {
      clearInterval(poll);
      isScrollingRef.current = false;
      measureTarget();
    }, 800);
  }, [currentStep, measureTarget]);

  // Listen for tour start event
  useEffect(() => {
    function onStart() {
      setStepIndex(0);
      setActive(true);
    }
    window.addEventListener("ds-start-tour", onStart);
    return () => window.removeEventListener("ds-start-tour", onStart);
  }, []);

  // On step change, scroll and measure
  useEffect(() => {
    if (!active) return;
    scrollAndMeasure();
  }, [active, stepIndex, scrollAndMeasure]);

  // Re-measure on resize and scroll (debounced)
  useEffect(() => {
    if (!active) return;

    const onResize = () => measureTarget();
    const onScroll = () => {
      if (isScrollingRef.current) return; // skip during programmatic scroll
      if (scrollDebounceRef.current) clearTimeout(scrollDebounceRef.current);
      scrollDebounceRef.current = setTimeout(measureTarget, 80);
    };

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      if (scrollDebounceRef.current) clearTimeout(scrollDebounceRef.current);
    };
  }, [active, measureTarget]);

  function next() {
    if (stepIndex < steps.length - 1) {
      setStepIndex(i => i + 1);
    } else {
      end();
    }
  }

  function prev() {
    if (stepIndex > 0) setStepIndex(i => i - 1);
  }

  function end() {
    setActive(false);
    setTargetRect(null);
    setStepIndex(0);
  }

  if (!active || !currentStep) return null;

  // ── Tooltip positioning (all in viewport coordinates) ──────────────────────
  let tooltipTop = 0;
  let tooltipLeft = 0;
  let arrowPosition: "top" | "bottom" = "top";

  if (targetRect) {
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Horizontal: centre on target, clamp to viewport edges
    tooltipLeft = Math.max(8, Math.min(targetCenterX - TOOLTIP_WIDTH / 2, vw - TOOLTIP_WIDTH - 8));

    const TOOLTIP_H = 180; // conservative estimate
    const spaceBelow = vh - (targetRect.top + targetRect.height + PADDING);
    const spaceAbove = targetRect.top - PADDING;

    if (spaceBelow >= TOOLTIP_H || spaceBelow >= spaceAbove) {
      tooltipTop = targetRect.top + targetRect.height + PADDING;
      arrowPosition = "top";
    } else {
      tooltipTop = targetRect.top - PADDING - TOOLTIP_H;
      arrowPosition = "bottom";
    }

    // Clamp vertically
    tooltipTop = Math.max(60, Math.min(tooltipTop, vh - TOOLTIP_H - 8));
  }

  // Use a fragment — any wrapper div with an opacity animation creates a stacking
  // context that traps child z-indices, causing the tour to render below z-50 elements.
  return (
    <>
      {/* Dark overlay with elliptical cutout — all positions are viewport coords */}
      <div
        className="fixed inset-0 z-[9000] pointer-events-none"
        style={{
          background: "rgba(0,0,0,0.78)",
          backdropFilter: "blur(1px)",
          WebkitMaskImage: targetRect
            ? `radial-gradient(ellipse ${targetRect.width / 2 + PADDING * 2}px ${targetRect.height / 2 + PADDING * 2}px at ${targetRect.left + targetRect.width / 2}px ${targetRect.top + targetRect.height / 2}px, transparent 60%, black 100%)`
            : "none",
          maskImage: targetRect
            ? `radial-gradient(ellipse ${targetRect.width / 2 + PADDING * 2}px ${targetRect.height / 2 + PADDING * 2}px at ${targetRect.left + targetRect.width / 2}px ${targetRect.top + targetRect.height / 2}px, transparent 60%, black 100%)`
            : "none",
        }}
      />

      {/* Highlight ring */}
      {targetRect && (
        <div
          className="fixed z-[9001] pointer-events-none rounded-lg"
          style={{
            top: targetRect.top - PADDING,
            left: targetRect.left - PADDING,
            width: targetRect.width + PADDING * 2,
            height: targetRect.height + PADDING * 2,
            border: "2px solid color-mix(in srgb, var(--accent, #BE8C2A) 80%, transparent)",
            boxShadow: "0 0 0 4px color-mix(in srgb, var(--accent, #BE8C2A) 12%, transparent), 0 0 24px color-mix(in srgb, var(--accent, #BE8C2A) 25%, transparent)",
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className="fixed z-[9002] rounded-xl shadow-2xl"
        style={{
          top: tooltipTop,
          left: tooltipLeft,
          width: TOOLTIP_WIDTH,
          background: "var(--bg-raised, #1B2126)",
          border: "1px solid color-mix(in srgb, var(--accent, #BE8C2A) 35%, transparent)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
          animation: "tour-spotlight 0.2s ease both",
        }}
      >
        {/* Arrow */}
        <div
          className="absolute"
          style={
            arrowPosition === "top"
              ? {
                  top: -7,
                  left: Math.min(
                    Math.max(12, (targetRect ? targetRect.left + targetRect.width / 2 - tooltipLeft - 7 : TOOLTIP_WIDTH / 2 - 7)),
                    TOOLTIP_WIDTH - 26
                  ),
                  width: 14, height: 7,
                  borderLeft: "7px solid transparent",
                  borderRight: "7px solid transparent",
                  borderBottom: "7px solid color-mix(in srgb, var(--accent, #BE8C2A) 35%, transparent)",
                }
              : {
                  bottom: -7,
                  left: Math.min(
                    Math.max(12, (targetRect ? targetRect.left + targetRect.width / 2 - tooltipLeft - 7 : TOOLTIP_WIDTH / 2 - 7)),
                    TOOLTIP_WIDTH - 26
                  ),
                  width: 14, height: 7,
                  borderLeft: "7px solid transparent",
                  borderRight: "7px solid transparent",
                  borderTop: "7px solid color-mix(in srgb, var(--accent, #BE8C2A) 35%, transparent)",
                }
          }
        />

        <div className="p-5">
          {/* Step counter */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "var(--accent, #BE8C2A)" }}>
              {stepIndex + 1} / {steps.length}
            </span>
            <button
              onClick={end}
              className="text-white/25 hover:text-white/60 transition-colors"
              aria-label="Close tour"
            >
              <X size={14} />
            </button>
          </div>

          <p className="text-white font-semibold text-sm mb-2 leading-snug">{currentStep.title}</p>
          <p className="text-white/60 text-xs leading-relaxed mb-4">{currentStep.text}</p>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={prev}
              disabled={stepIndex === 0}
              className="flex items-center gap-1 text-xs text-white/35 hover:text-white/65 disabled:opacity-20 transition-colors"
            >
              <ArrowLeft size={11} weight="bold" /> Back
            </button>

            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStepIndex(i)}
                  className="rounded-full transition-all duration-200"
                  style={{
                    width: i === stepIndex ? 16 : 6,
                    height: 6,
                    background: i === stepIndex ? "var(--accent, #BE8C2A)" : "rgba(255,255,255,0.18)",
                  }}
                  aria-label={`Go to step ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="btn-primary text-xs flex items-center gap-1 px-3 py-1.5"
            >
              {!isLastStep ? (
                <>Next <ArrowRight size={11} weight="bold" /></>
              ) : (
                <>Finish <ArrowRight size={11} weight="bold" /></>
              )}
            </button>
          </div>

          {/* Portal dashboard CTA — final step only */}
          {isLastStep && portalDemoUrl && (
            <a
              href={portalDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-1.5 w-full rounded-lg py-2 text-xs font-semibold transition-all"
              style={{
                background: "color-mix(in srgb, var(--accent, #BE8C2A) 10%, transparent)",
                border: "1px solid color-mix(in srgb, var(--accent, #BE8C2A) 30%, transparent)",
                color: "var(--accent, #BE8C2A)",
              }}
            >
              See Your Client Dashboard <ArrowRight size={11} weight="bold" />
            </a>
          )}
        </div>
      </div>

      {/* Click backdrop to advance */}
      <div className="fixed inset-0 z-[8999] cursor-pointer" onClick={next} aria-hidden="true" />
    </>
  );
}
