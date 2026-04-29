"use client";
import React from "react";

export default function SuggestionChips({ suggestions, personaColor, onSelect }: { suggestions: string[]; personaColor: string; onSelect: (s: string) => void }) {
  if (!suggestions || suggestions.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((s, i) => (
        <button key={i} onClick={() => onSelect(s)} className="px-3 py-1.5 text-sm rounded-full border" style={{ borderColor: personaColor }}>
          {s}
        </button>
      ))}
    </div>
  );
}
