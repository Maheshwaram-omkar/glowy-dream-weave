import { useEffect, useRef } from "react";
import { MessageSquarePlus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessageBubble } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { TypingIndicator } from "@/components/TypingIndicator";
import { useChat } from "@/hooks/use-chat";
import { toast } from "@/hooks/use-toast";

const SUGGESTED_QUESTIONS = [
  "How many vacation days do I get?",
  "What's the remote work policy?",
  "How do expense reimbursements work?",
  "Tell me about the onboarding process",
];

const Index = () => {
  const { messages, isLoading, error, sendMessage, resetChat } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
    }
  }, [error]);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm font-semibold leading-tight">PolicyBot</h1>
            <p className="text-xs text-muted-foreground">Company Policy Assistant</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={resetChat} className="gap-1.5 text-xs">
          <MessageSquarePlus className="h-4 w-4" />
          New Chat
        </Button>
      </header>

      {/* Messages */}
      <ScrollArea className="flex-1" ref={scrollRef as any}>
        <div className="mx-auto max-w-2xl space-y-6 p-4 sm:p-6">
          {isEmpty ? (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Sparkles className="h-8 w-8" />
              </div>
              <h2 className="mb-2 text-xl font-semibold">How can I help you today?</h2>
              <p className="mb-8 max-w-sm text-sm text-muted-foreground">
                Ask me anything about company policies, benefits, IT support, or HR procedures.
              </p>
              <div className="grid w-full max-w-md gap-2 sm:grid-cols-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="rounded-xl border bg-card px-4 py-3 text-left text-sm text-card-foreground transition-colors hover:bg-accent"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <ChatMessageBubble key={i} message={msg} />
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && <TypingIndicator />}
            </>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="mx-auto w-full max-w-2xl">
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Index;
