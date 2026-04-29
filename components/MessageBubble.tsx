"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import { JsonPlanCard } from "./JsonPlanCard";
import { Message, PersonaMeta, StudyPlan } from "../lib/types";

interface Props {
  message: Message;
  persona: PersonaMeta;
  isUser: boolean;
}

function tryParseStudyPlan(content: string): StudyPlan | null {
  try {
    // Look for a JSON block that has both title and steps
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof parsed.title === "string" &&
      Array.isArray(parsed.steps)
    ) {
      return parsed as StudyPlan;
    }
    return null;
  } catch {
    return null;
  }
}

function Avatar({ isUser, persona }: { isUser: boolean; persona: PersonaMeta }) {
  if (isUser) {
    return (
      <div
        className="h-10 w-10 shrink-0 rounded-full border border-gray-200 bg-[#1f2937] text-white flex items-center justify-center text-xs font-semibold shadow-sm"
        aria-label="You"
      >
        You
      </div>
    );
  }

  return (
    <div className="h-10 w-10 shrink-0 rounded-full border border-white/80 bg-white p-0.5 shadow-sm overflow-hidden" aria-label={persona.name}>
      <img src={persona.avatar} alt={persona.name} className="h-full w-full rounded-full object-cover" />
    </div>
  );
}

export default function MessageBubble({ message, persona, isUser }: Props) {
  const plan = !isUser ? tryParseStudyPlan(message.content) : null;
  const bubbleClassName = isUser
    ? "bg-[#1f2937] text-white border border-[#1f2937]"
    : "bg-white text-gray-900 border border-gray-200 shadow-sm";

  return (
    <div className={`mb-4 flex items-end gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && <Avatar isUser={false} persona={persona} />}

      <div className={`min-w-0 max-w-[calc(100vw-5.5rem)] rounded-2xl px-4 py-3 break-words overflow-hidden ${bubbleClassName}`}>
        {plan ? (
          <JsonPlanCard plan={plan} personaColor={persona.color} />
        ) : (
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="leading-7 text-[15px] whitespace-pre-wrap">{children}</p>,
              h1: ({ children }) => <h1 className="text-xl font-semibold mb-2">{children}</h1>,
              h2: ({ children }) => <h2 className="text-lg font-semibold mb-2">{children}</h2>,
              h3: ({ children }) => <h3 className="text-base font-semibold mb-2">{children}</h3>,
              ul: ({ children }) => <ul className="my-2 ml-5 list-disc space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="my-2 ml-5 list-decimal space-y-1">{children}</ol>,
              li: ({ children }) => <li className="leading-7">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              em: ({ children }) => <em className="italic">{children}</em>,
              a: ({ children, href }) => (
                <a href={href} target="_blank" rel="noreferrer" className="underline underline-offset-4">
                  {children}
                </a>
              ),
              blockquote: ({ children }) => (
                <blockquote className="my-2 border-l-4 border-gray-300 pl-4 italic text-gray-600">{children}</blockquote>
              ),
              code: ({ children, className }) => {
                const isBlock = Boolean(className);
                return isBlock ? (
                  <code className="block overflow-x-auto rounded-lg bg-gray-100 px-3 py-2 font-mono text-sm text-gray-800">{children}</code>
                ) : (
                  <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[0.9em] text-gray-800">{children}</code>
                );
              },
              pre: ({ children }) => <pre className="my-3 overflow-x-auto rounded-lg bg-gray-100 p-3">{children}</pre>,
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>

      {isUser && <Avatar isUser={true} persona={persona} />}
    </div>
  );
}