"use client";
import React from "react";

export default function TypingIndicator({
  personaName,
  color,
  variant = "dots",
}: {
  personaName: string;
  color: string;
  variant?: "dots" | "cursor";
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-sm"
      style={{ borderColor: color + "33" }}
    >
      {variant === "dots" ? (
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full animate-pulse" style={{ backgroundColor: color, animationDelay: "0ms" }} />
          <span className="h-2.5 w-2.5 rounded-full animate-pulse" style={{ backgroundColor: color, animationDelay: "150ms" }} />
          <span className="h-2.5 w-2.5 rounded-full animate-pulse" style={{ backgroundColor: color, animationDelay: "300ms" }} />
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <span className="h-4 w-0.5 animate-pulse rounded-full" style={{ backgroundColor: color }} />
          <span className="text-sm font-semibold" style={{ color }}>
            {personaName} is typing
          </span>
        </div>
      )}
      <div className="text-xs text-gray-600">{personaName} is preparing a reply...</div>
      <style jsx>{`
        .animate-pulse {
          animation: pulse 1s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.35; transform: scaleY(0.95); }
          50% { opacity: 1; transform: scaleY(1.15); }
        }
      `}</style>
    </div>
  );
}
