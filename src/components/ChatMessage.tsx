import { memo } from "react";
import ReactMarkdown from "react-markdown";
import { Bot, User, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ChatMessage as ChatMessageType } from "@/lib/chat-stream";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessageBubble = memo(function ChatMessageBubble({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const time = message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={cn("flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300", isUser ? "flex-row-reverse" : "flex-row")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div className={cn("flex max-w-[80%] flex-col gap-1", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-card text-card-foreground border rounded-bl-md"
          )}
        >
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-2 [&>ul]:mb-2 [&>ol]:mb-2 [&>p:last-child]:mb-0">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Source attribution */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-1">
            {message.sources.map((s) => (
              <Badge key={s.id} variant="secondary" className="gap-1 text-xs font-normal">
                <FileText className="h-3 w-3" />
                {s.title}
                <span className="text-muted-foreground">({(s.score * 100).toFixed(0)}%)</span>
              </Badge>
            ))}
          </div>
        )}

        <span className="px-1 text-xs text-muted-foreground">{time}</span>
      </div>
    </div>
  );
});
