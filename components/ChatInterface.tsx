"use client";
import React, { useMemo, useRef, useState, useEffect } from "react";
import { useChat } from "../hooks/useChat";
import PERSONA_META from "../lib/personaMeta";
import { PersonaMeta } from "../lib/types";
import PersonaSwitcher from "./PersonaSwitcher";
import SuggestionChips from "./SuggestionChips";
import TypingIndicator from "./TypingIndicator";
import MessageBubble from "./MessageBubble";

export default function ChatInterface() {
  const personaList: PersonaMeta[] = Object.values(PERSONA_META);
  const [activePersonaId, setActivePersonaId] = useState<string>(personaList[0].id);
  const { messages, isLoading, isWaitingForFirstChunk, error, sendMessage, setError } = useChat(activePersonaId);
  const [input, setInput] = useState("");
  const [resetToast, setResetToast] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // scroll to bottom on messages change
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const activePersona = useMemo(() => PERSONA_META[activePersonaId], [activePersonaId]);

  useEffect(() => {
    if (!resetToast) return;

    const timeout = window.setTimeout(() => setResetToast(null), 2400);
    return () => window.clearTimeout(timeout);
  }, [resetToast]);

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(input.trim());
    setInput("");
  };

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden bg-gradient-to-b from-[#fbfbfb] via-white to-[#f5f7fb]">
      <PersonaSwitcher
        personas={personaList}
        activePersonaId={activePersonaId}
        onSwitch={(id) => {
          setActivePersonaId(id);
          setInput("");
          setResetToast(`Conversation reset for ${PERSONA_META[id].name}`);
        }}
      />

      {resetToast && (
        <div className="px-4 pt-3">
          <div className="mx-auto max-w-2xl rounded-full border border-gray-200 bg-white/90 px-4 py-2 text-center text-xs font-medium text-gray-700 shadow-sm backdrop-blur">
            {resetToast}
          </div>
        </div>
      )}

      <div className="px-4 pt-4 shrink-0">
        <div className="max-w-2xl mx-auto rounded-2xl border border-gray-200 bg-white/85 backdrop-blur px-4 py-3 shadow-sm flex items-center gap-3">
          <img src={activePersona.avatar} alt={activePersona.name} className="h-12 w-12 rounded-full object-cover border-2" style={{ borderColor: activePersona.color }} />
          <div className="min-w-0 flex-1">
            <div className="text-[11px] uppercase tracking-[0.2em] text-gray-500">Active persona</div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-semibold text-gray-900">{activePersona.name}</h1>
              <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: activePersona.accentColor, color: activePersona.color }}>
                {activePersona.title}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 min-h-0 overflow-y-auto p-4 pb-24">
        {messages.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-12">
            <h2 className="text-lg font-semibold" style={{ color: activePersona.color }}>{activePersona.greeting}</h2>
            <div className="mt-4"><SuggestionChips suggestions={activePersona.suggestions} personaColor={activePersona.color} onSelect={(s) => sendMessage(s)} /></div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {messages.map((m, i) => (
              <MessageBubble key={i} message={m} persona={activePersona} isUser={m.role === 'user'} />
            ))}
          </div>
        )}

        {isLoading && (
          <div className="max-w-2xl mx-auto mt-2">
            <TypingIndicator 
              personaName={activePersona.name} 
              color={activePersona.color} 
              variant={isWaitingForFirstChunk ? "cursor" : "dots"}
            />
          </div>
        )}
      </div>

      {error && (
        <div className="mx-4 mb-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">Could not send message</div>
              <div className="mt-1 text-sm leading-6">{error}</div>
            </div>
            <button onClick={() => setError(null)} className="rounded-full px-2 py-1 text-sm font-semibold text-red-500 transition hover:bg-red-100" aria-label="Dismiss error">
              ×
            </button>
          </div>
        </div>
      )}

      <div className="shrink-0 border-t border-gray-200 bg-white/95 backdrop-blur px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 sticky bottom-0">
        <div className="max-w-2xl mx-auto">
          <textarea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            className="w-full rounded-xl border border-gray-200 p-3 text-[15px] leading-6 outline-none focus:border-gray-400"
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <div className="mt-2 flex justify-end">
            <button onClick={handleSend} disabled={isLoading || !input.trim()} className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
