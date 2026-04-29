"use client";
import React from "react";
import { PersonaMeta } from "../lib/types";

export default function PersonaSwitcher({ personas, activePersonaId, onSwitch }: { personas: PersonaMeta[]; activePersonaId: string; onSwitch: (id: string) => void }) {
  return (
    <div className="border-b border-gray-100 bg-white px-3 py-2 shadow-sm md:px-4">
      <div className="mx-auto flex w-full max-w-6xl gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-3 md:overflow-visible">
        {personas.map((p) => {
          const active = p.id === activePersonaId;
          return (
            <button
              key={p.id}
              onClick={() => onSwitch(p.id)}
              className={`min-w-[78vw] shrink-0 snap-start rounded-xl border px-3 py-2 text-left transition md:min-w-0 md:w-full ${active ? "bg-gray-50 shadow-sm border-gray-200" : "border-transparent"}`}
              style={active ? { boxShadow: `0 0 0 2px ${p.color}33` } : undefined}
            >
              <div className="flex items-center gap-3">
                <img src={p.avatar} alt={p.name} className="h-9 w-9 rounded-full object-cover border border-gray-200" />
                <div className="min-w-0">
                  <div className={`text-sm font-semibold truncate ${active ? "text-gray-900" : "text-gray-600"}`}>{p.name}</div>
                  <div className="text-[11px] text-gray-500 truncate">{p.title}</div>
                </div>
              </div>
              {active && <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: p.color }}>Active persona</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
