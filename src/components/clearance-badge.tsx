"use client";

import type { Clearance } from "@/lib/types";

interface ClearanceBadgeProps {
  clearance: Clearance;
  score: number;
  animated?: boolean;
  size?: "default" | "lg" | "sm";
  showScore?: boolean;
}

const STAMP: Record<
  Clearance,
  { label: string; sub: string; color: string }
> = {
  go: { label: "CLEARED", sub: "SHIP IT", color: "#0f7a4c" },
  hold: { label: "HOLD", sub: "FIX THEN SHIP", color: "#b45309" },
  no_go: { label: "DENIED", sub: "DON'T SHIP", color: "#c01d2e" },
};

const SIZE = {
  sm: 112,
  default: 148,
  lg: 176,
} as const;

export function ClearanceBadge({
  clearance,
  score,
  animated = true,
  size = "default",
  showScore = true,
}: ClearanceBadgeProps) {
  const stamp = STAMP[clearance];
  const dim = SIZE[size];

  return (
    <div
      className={`inline-flex flex-col items-center justify-center ${
        animated ? "animate-stamp" : ""
      }`}
      style={animated ? undefined : { transform: "rotate(-8deg)" }}
    >
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 200 200"
        aria-label={`Site clearance ${stamp.label}`}
        className="drop-shadow-[0_2px_0_rgba(15,18,24,0.06)]"
      >
        <circle
          cx="100"
          cy="100"
          r="92"
          fill="none"
          stroke={stamp.color}
          strokeWidth="5"
        />
        <circle
          cx="100"
          cy="100"
          r="82"
          fill="none"
          stroke={stamp.color}
          strokeWidth="2"
          strokeDasharray="3 4"
          opacity="0.7"
        />
        <circle
          cx="100"
          cy="100"
          r="74"
          fill="none"
          stroke={stamp.color}
          strokeWidth="1.5"
          opacity="0.45"
        />
        <text
          x="100"
          y="58"
          textAnchor="middle"
          fill={stamp.color}
          fontFamily="JetBrains Mono, monospace"
          fontSize="9"
          fontWeight="700"
          letterSpacing="3"
          opacity="0.75"
        >
          SITE CLEARANCE
        </text>
        <text
          x="100"
          y="108"
          textAnchor="middle"
          fill={stamp.color}
          fontFamily="Space Grotesk, sans-serif"
          fontSize={stamp.label.length > 6 ? "26" : "30"}
          fontWeight="700"
          letterSpacing="1.5"
        >
          {stamp.label}
        </text>
        <text
          x="100"
          y="138"
          textAnchor="middle"
          fill={stamp.color}
          fontFamily="JetBrains Mono, monospace"
          fontSize="9"
          fontWeight="700"
          letterSpacing="2.5"
          opacity="0.8"
        >
          {stamp.sub}
        </text>
      </svg>
      {showScore && (
        <div
          className="mt-2 text-center"
          style={{ transform: "rotate(8deg)" }}
        >
          <span className="font-display text-2xl font-semibold tracking-tight text-[var(--pass-ink)]">
            {score}
          </span>
          <span className="ml-1 font-mono text-xs text-[var(--pass-mute)]">
            /100
          </span>
        </div>
      )}
    </div>
  );
}
