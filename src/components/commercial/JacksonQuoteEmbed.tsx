import { useState, useEffect, useRef } from "react";
import { Loader2, Settings } from "lucide-react";
import { useQuotePrefill, prefillToParams, prefillToMessage } from "@/lib/quotePrefill";

// Environment variable for quote tool URL
const QUOTE_TOOL_URL = import.meta.env.VITE_QUOTE_TOOL_URL || "";

interface QuoteEmbedProps {
  className?: string;
  onQuoteStarted?: () => void;
  onQuoteUpdated?: (summary: string, data?: Record<string, unknown>) => void;
  onQuoteSubmitted?: (quoteId: string, email: string) => void;
}

export const JacksonQuoteEmbed = ({
  className = "",
  onQuoteStarted,
  onQuoteUpdated,
  onQuoteSubmitted,
}: QuoteEmbedProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [iframeHeight, setIframeHeight] = useState(500);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isReadyRef = useRef(false);
  const prefill = useQuotePrefill();

  // Build embed URL once — prefill present at mount goes in the query string.
  // Later estimator changes are pushed over postMessage so the iframe never reloads.
  const embedUrlRef = useRef<string>("");
  if (!embedUrlRef.current && QUOTE_TOOL_URL) {
    const params = new URLSearchParams({
      embed: "1",
      source: "commercialpro",
      ...prefillToParams(prefill),
    });
    embedUrlRef.current = `${QUOTE_TOOL_URL}?${params.toString()}`;
  }
  const embedUrl = embedUrlRef.current;

  // Origin of the quote tool — used to scope postMessage in both directions
  const quoteOrigin = (() => {
    try {
      return QUOTE_TOOL_URL ? new URL(QUOTE_TOOL_URL).origin : "";
    } catch {
      return "";
    }
  })();

  // Push prefill updates into the iframe whenever the estimator changes
  useEffect(() => {
    if (!isReadyRef.current || !quoteOrigin) return;
    iframeRef.current?.contentWindow?.postMessage(prefillToMessage(prefill), quoteOrigin);
  }, [prefill, quoteOrigin]);


  // Listen for postMessage events from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only trust messages coming from the quote tool origin
      if (!quoteOrigin || event.origin !== quoteOrigin) return;

      const { type, ...data } = event.data || {};


      switch (type) {
        case "WPW_QUOTE_HEIGHT":
          if (typeof data.height === "number") {
            setIframeHeight(data.height);
          }
          break;
        case "WPW_QUOTE_STARTED":
          onQuoteStarted?.();
          break;
        case "WPW_QUOTE_UPDATED":
          onQuoteUpdated?.(data.summary || "", data);
          break;
        case "WPW_QUOTE_SUBMITTED":
          onQuoteSubmitted?.(data.quote_id || "", data.email || "");
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onQuoteStarted, onQuoteUpdated, onQuoteSubmitted]);

  // Placeholder when URL is not set
  if (!QUOTE_TOOL_URL) {
    return (
      <div
        className={`bg-card border border-border rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px] ${className}`}
      >
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Settings className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Quote Tool Loading...
        </h3>
        <p className="text-muted-foreground text-center text-sm max-w-xs">
          The instant quote calculator will appear here once connected.
        </p>
        <p className="text-xs text-muted-foreground/60 mt-4 font-mono">
          Set VITE_QUOTE_TOOL_URL to enable embed
        </p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-card rounded-xl flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading quote tool...</p>
          </div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={embedUrl}
        className="w-full rounded-xl border-0"
        style={{ height: `${iframeHeight}px` }}
        onLoad={() => {
          setIsLoading(false);
          isReadyRef.current = true;
          // Re-send current prefill in case the estimator changed before load
          iframeRef.current?.contentWindow?.postMessage(prefillToMessage(prefill), "*");
        }}
        title="WePrintWraps Quote Calculator"
        allow="clipboard-write"
      />

    </div>
  );
};
