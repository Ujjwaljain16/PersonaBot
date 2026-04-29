"use client";
import React from "react";
import { StudyPlan } from "../lib/types";

interface Props {
  plan: StudyPlan;
  personaColor: string;
}

export function JsonPlanCard({ plan, personaColor }: Props) {
  return (
    <div className="rounded-xl border-2 bg-white overflow-hidden shadow-sm" style={{ borderColor: personaColor }}>
      <div className="px-4 py-3 text-white font-semibold text-sm" style={{ backgroundColor: personaColor }}>
        📋 {plan.title}
      </div>
      <div className="divide-y">
        {plan.steps.map((step, i) => (
          <div key={i} className="px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: personaColor }}>
                {step.week}
              </span>
              <span className="font-medium text-sm text-gray-800">{step.focus}</span>
            </div>
            <ul className="ml-2 space-y-1">
              {step.tasks.map((task, j) => (
                <li key={j} className="text-xs text-gray-600 flex items-start gap-1">
                  <span className="mt-0.5">→</span> {task}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {plan.tip && (
        <div className="px-4 py-3 bg-gray-50 text-xs text-gray-600 italic border-t">💡 {plan.tip}</div>
      )}
    </div>
  );
}

export default JsonPlanCard;
