"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowRight, ArrowLeft, X } from "@phosphor-icons/react";
import type { TourStep } from "@/lib/demo-config";

interface Props {
  steps: TourStep[];
}

interface StepRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PADDING = 12;

export default function GuidedTour({ steps }: Props) {
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<StepRect | null>(null);

  const currentStep = steps[stepIndex];

  const measureTarget = useCallback(() => {
    if (!currentStep) return;
    const el = document.querySelector(currentStep.target);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setTargetRect({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      height: rect.height,
    });
    // Scroll element into view with some offset
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [currentStep]);

  useEffect(() => {
    function onStart() {
      setStepIndex(0);
      setActive(true);
    }
    window.addEventListener("ds-start-tour", onStart);
    return () => window.removeEventListener("ds-start-tour", onStart);
  }, []);

  useEffect(() => {
    if (!active) return;
    // Measure after scroll settles
    const timer = setTimeout(measureTarget, 350);
    return () => clearTimeout(timer);
  }, [active, stepIndex, measureTarget]);

  // Recompute on resize
  useEffect(() => {
    if (!active) return;
    window.addEventListener("resize", measureTarget, { passive: true });
    return () => window.removeEventListener("resize", measureTarget);
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

  // Tooltip position logic — prefer below target, fall back to above
  const tooltipWidth = 280;
  let tooltipTop = 0;
  let tooltipLeft = 0;
  let arrowPosition: "top" | "bottom" = "top";

  if (targetRect) {
    const targetCenterX = targetRect.left + targetRect.width / 2;
    tooltipLeft = Math.max(8, Math.min(targetCenterX - tooltipWidth / 2, window.innerWidth - tooltipWidth - 8));

    const belowTop = targetRect.top + targetRect.height + PADDING;
    const aboveTop = targetRect.top - 150 - PADDING;

    if (belowTop + 150 < window.innerHeight + window.scrollY) {
      tooltipTop = belowTop;
      arrowPosition = "top";
    } else {
      tooltipTop = aboveTop;
      arrowPosition = "bottom";
    }
  }

  return (
    <div className="tour-overlay">
      {/* Dark overlay with cutout for target */}
      <div
        className="fixed inset-0 z-[100] pointer-events-none"
        style={{
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(2px)",
          WebkitMaskImage: targetRect
            ? `radial-gradient(ellipse ${targetRect.width + PADDING * 2}px ${targetRect.height + PADDING * 2}px at ${targetRect.left + targetRect.width / 2}px ${targetRect.top - window.scrollY + targetRect.height / 2}px, transparent 80%, black 100%)`
            : "none",
        }}
      />

      {/* Highlight ring around target */}
      {targetRect && (
        <div
          className="fixed z-[101] pointer-events-none rounded"
          style={{
            top: targetRect.top - PADDING - window.scrollY,
            left: targetRect.left - PADDING,
            width: targetRect.width + PADDING * 2,
            height: targetRect.height + PADDING * 2,
            border: "2px solid rgba(190,140,42,0.8)",
            boxShadow: "0 0 0 4px rgba(190,140,42,0.15), 0 0 20px rgba(190,140,42,0.3)",
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className="fixed z-[102] p-4 rounded-xl shadow-2xl"
        style={{
          top: tooltipTop - window.scrollY,
          left: tooltipLeft,
          width: tooltipWidth,
          background: "#1B2126",
          border: "1px solid rgba(190,140,42,0.4)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(190,140,42,0.1)",
        }}
      >
        {/* Arrow */}
        <div
          className="absolute"
          style={
            arrowPosition === "top"
              ? {
                  top: -7,
                  left: tooltipWidth / 2 - 7,
                  width: 14, height: 7,
                  borderLeft: "7px solid transparent",
                  borderRight: "7px solid transparent",
                  borderBottom: "7px solid rgba(190,140,42,0.4)",
                }
              : {
                  bottom: -7,
                  left: tooltipWidth / 2 - 7,
                  width: 14, height: 7,
                  borderLeft: "7px solid transparent",
                  borderRight: "7px solid transparent",
                  borderTop: "7px solid rgba(190,140,42,0.4)",
                }
          }
        />

        {/* Step counter */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#BE8C2A" }}>
            Step {stepIndex + 1} of {steps.length}
          </span>
          <button onClick={end} className="text-white/30 hover:text-white/70 transition-colors" aria-label="Close tour">
            <X size={14} />
          </button>
        </div>

        <p className="text-white font-semibold text-sm mb-1">{currentStep.title}</p>
        <p className="text-white/60 text-xs leading-relaxed mb-4">{currentStep.text}</p>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={prev}
            disabled={stepIndex === 0}
            className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 disabled:opacity-20 transition-colors"
          >
            <ArrowLeft size={12} weight="bold" /> Back
          </button>

          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full transition-all duration-200"
                style={{ background: i === stepIndex ? "#BE8C2A" : "rgba(255,255,255,0.2)" }}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="btn-gold text-xs flex items-center gap-1"
          >
            {stepIndex < steps.length - 1 ? (
              <>Next <ArrowRight size={11} weight="bold" /></>
            ) : (
              <>Book a Call <ArrowRight size={11} weight="bold" /></>
            )}
          </button>
        </div>
      </div>

      {/* Click anywhere to advance (except tooltip) */}
      <div className="fixed inset-0 z-[99] cursor-pointer" onClick={next} aria-hidden="true" />
    </div>
  );
}
