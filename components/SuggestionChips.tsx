"use client";
import React from "react";

export default function SuggestionChips({ suggestions, personaColor, onSelectAction }: { suggestions: string[]; personaColor: string; onSelectAction: (s: string) => void }) {
  if (!suggestions || suggestions.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((s, i) => (
        <button key={i} onClick={() => onSelectAction(s)} className="px-3 py-1.5 text-sm rounded-full border" style={{ borderColor: personaColor }}>
          {s}
        </button>
      ))}
    </div>
  );
}
