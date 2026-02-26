import { useState, useCallback, useRef, useEffect } from "react";
import { streamChat, type ChatMessage } from "@/lib/chat-stream";

function getSessionId(): string {
  let id = localStorage.getItem("chat-session-id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("chat-session-id", id);
  }
  return id;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionIdRef = useRef(getSessionId());

  const sendMessage = useCallback(async (input: string) => {
    if (!input.trim() || isLoading) return;

    setError(null);
    const userMsg: ChatMessage = { role: "user", content: input, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    let assistantSoFar = "";
    let currentSources: { title: string; id: string; score: number }[] = [];

    await streamChat({
      message: input,
      sessionId: sessionIdRef.current,
      onDelta: (chunk) => {
        assistantSoFar += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) =>
              i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
            );
          }
          return [
            ...prev,
            { role: "assistant", content: assistantSoFar, timestamp: new Date(), sources: currentSources },
          ];
        });
      },
      onSources: (sources) => {
        currentSources = sources;
      },
      onDone: () => {
        // Update sources on final message
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) =>
              i === prev.length - 1 ? { ...m, sources: currentSources } : m
            );
          }
          return prev;
        });
        setIsLoading(false);
      },
      onError: (err) => {
        setError(err);
        setIsLoading(false);
      },
    });
  }, [isLoading]);

  const resetChat = useCallback(() => {
    setMessages([]);
    setError(null);
    const newId = crypto.randomUUID();
    localStorage.setItem("chat-session-id", newId);
    sessionIdRef.current = newId;
  }, []);

  return { messages, isLoading, error, sendMessage, resetChat };
}
