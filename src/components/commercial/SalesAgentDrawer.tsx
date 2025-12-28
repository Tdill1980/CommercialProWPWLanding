import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, RefreshCw, Phone, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSalesChat } from "@/hooks/useSalesChat";

interface SalesAgentDrawerProps {
  trigger?: React.ReactNode;
}

export function SalesAgentDrawer({ trigger }: SalesAgentDrawerProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, isLoading, error, sendMessage, clearChat } = useSalesChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when drawer opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput("");
  };

  const handleNewChat = () => {
    clearChat();
    setInput("");
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            <span>Chat with Sales</span>
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="h-[85vh] max-h-[700px]">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DrawerHeader className="border-b border-border px-4 py-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DrawerTitle className="text-base font-semibold">
                    Sales Assistant
                  </DrawerTitle>
                  <p className="text-xs text-muted-foreground">
                    Ask about pricing, volume discounts & more
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNewChat}
                  className="h-8 w-8"
                  title="New conversation"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <DrawerClose asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </DrawerClose>
              </div>
            </div>
          </DrawerHeader>

          {/* Messages */}
          <ScrollArea className="flex-1 px-4" ref={scrollRef}>
            <div className="py-4 space-y-4">
              {/* Welcome message */}
              {messages.length === 0 && (
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-foreground">
                      👋 Hey there! I'm here to help you learn about our wholesale wrap printing services.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Ask me about pricing, volume discounts, turnaround times, or our 3D proofing system!
                    </p>
                  </div>
                  
                  {/* Quick prompts */}
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-medium">Quick questions:</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "What are your prices?",
                        "Volume discounts?",
                        "How fast do you ship?",
                        "Tell me about 3D proofs",
                      ].map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => sendMessage(prompt)}
                          disabled={isLoading}
                          className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Chat messages */}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-4 py-2.5 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-2.5">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="bg-destructive/10 text-destructive rounded-lg px-4 py-2.5 text-sm">
                  {error}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Escalation strip */}
          <div className="border-t border-border px-4 py-2 bg-muted/30 flex-shrink-0">
            <p className="text-xs text-muted-foreground mb-2">
              Need to talk to a human?
            </p>
            <div className="flex gap-2">
              <a
                href="tel:1-800-555-0199"
                className="flex items-center gap-1.5 text-xs text-primary hover:underline"
              >
                <Phone className="h-3 w-3" />
                Call Sales
              </a>
              <span className="text-muted-foreground">•</span>
              <a
                href="mailto:commercial@weprintwraps.com"
                className="flex items-center gap-1.5 text-xs text-primary hover:underline"
              >
                <Mail className="h-3 w-3" />
                Email Us
              </a>
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-border p-4 flex-shrink-0">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about pricing, volume discounts..."
                className="flex-1 px-4 py-2.5 text-sm bg-muted rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-primary/20"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading}
                className="h-10 w-10 flex-shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
