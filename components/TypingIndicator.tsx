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
      className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
      style={{ borderColor: color + "33" }}
    >
      {variant === "dots" ? (
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full animate-bounce" style={{ backgroundColor: color, animationDelay: "0ms" }} />
          <span className="h-2 w-2 rounded-full animate-bounce" style={{ backgroundColor: color, animationDelay: "150ms" }} />
          <span className="h-2 w-2 rounded-full animate-bounce" style={{ backgroundColor: color, animationDelay: "300ms" }} />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="h-4 w-1 animate-pulse rounded-full" style={{ backgroundColor: color }} />
            <span className="h-4 w-1 animate-pulse rounded-full" style={{ backgroundColor: color, animationDelay: "200ms" }} />
          </div>
          <span className="text-sm font-medium" style={{ color }}>
            {personaName} is thinking...
          </span>
        </div>
      )}
      <div className="text-xs text-gray-400 font-medium ml-auto">
        {variant === "cursor" ? "Analyzing query" : "Generating response"}
      </div>
    </div>
  );
}
