"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Message, ApiMessage, StudyPlan } from "../lib/types";

const REQUEST_TIMEOUT = 60000; // 60 seconds
const MAX_RETRIES = 2;

function tryParseStudyPlan(text: string): StudyPlan | null {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.title && parsed.steps) return parsed as StudyPlan;
    }
  } catch (e) {}
  return null;
}

export function useChat(personaId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isWaitingForFirstChunk, setIsWaitingForFirstChunk] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Cancel any pending request when persona changes
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setMessages([]);
    setError(null);
    setIsLoading(false);
    setIsWaitingForFirstChunk(false);
  }, [personaId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: Message = {
        role: "user",
        content: content.trim(),
        timestamp: new Date().toISOString(),
      };

      const updated = [...messages, userMessage];
      setMessages(updated);
      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      const currentAbortController = abortControllerRef.current;

      let retries = 0;

      const attemptRequest = async (): Promise<void> => {
        try {
          // Set up request timeout
          const timeoutId = setTimeout(() => {
            if (currentAbortController && !currentAbortController.signal.aborted) {
              currentAbortController.abort();
            }
          }, REQUEST_TIMEOUT);

          try {
            const apiMessages: ApiMessage[] = updated.map((m) => ({ role: m.role, content: m.content }));

            const res = await fetch("/api/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ messages: apiMessages, personaId }),
              signal: currentAbortController.signal,
            });

            clearTimeout(timeoutId);

            if (!res.ok) {
              const errorText = await res.text();
              let errorMessage = "Something went wrong";

              try {
                const parsed = JSON.parse(errorText);
                errorMessage = parsed.error || errorMessage;
              } catch {
                errorMessage = errorText || errorMessage;
              }

              // Retry on 503 (service unavailable) or 500 if retries remain
              if ((res.status === 503 || res.status === 500) && retries < MAX_RETRIES) {
                console.warn(`Request failed with ${res.status}, retrying... (${retries + 1}/${MAX_RETRIES})`);
                retries++;
                await new Promise((r) => setTimeout(r, 1000)); // Wait 1s before retry
                return attemptRequest();
              }

              setError(errorMessage);
              setIsLoading(false);
              return;
            }

            if (!res.body) {
              setError("Streaming response was unavailable. Please try again.");
              setIsLoading(false);
              return;
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let assistantText = "";
            let receivedFirstChunk = false;

            setIsWaitingForFirstChunk(true);
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: "",
                timestamp: new Date().toISOString(),
              },
            ]);

            while (true) {
              // Check if abort was called
              if (currentAbortController.signal.aborted) {
                setError("Request was cancelled.");
                setIsLoading(false);
                setIsWaitingForFirstChunk(false);
                return;
              }

              const { done, value } = await reader.read();
              if (done) break;

              if (!receivedFirstChunk) {
                receivedFirstChunk = true;
                setIsWaitingForFirstChunk(false);
 
             }

              assistantText += decoder.decode(value, { stream: true });
              setMessages((prev) => [
                ...prev.slice(0, -1),
                {
                  role: "assistant",
                  content: assistantText,
                  timestamp: new Date().toISOString(),
                },
              ]);
            }

            assistantText += decoder.decode();
            if (assistantText) {
              setMessages((prev) => [
                ...prev.slice(0, -1),
                {
                  role: "assistant",
                  content: assistantText,
                  timestamp: new Date().toISOString(),
                },
              ]);
            }
          } finally {
            clearTimeout(timeoutId);
          }
        } catch (e) {
          if (e instanceof Error) {
            if (e.name === "AbortError") {
              setError("Request was cancelled.");
            } else if (e.message.includes("Failed to fetch")) {
              setError("Network error. Check your connection and try again.");
            } else {
              setError(e.message || "An error occurred. Please try again.");
            }
          } else {
            setError("An unexpected error occurred. Please try again.");
          }
        } finally {
          setIsLoading(false);
          setIsWaitingForFirstChunk(false);
        }
      };

      await attemptRequest();
    },
    [messages, personaId, isLoading]
  );

  return { messages, isLoading, isWaitingForFirstChunk, error, sendMessage, setError } as const;
}
