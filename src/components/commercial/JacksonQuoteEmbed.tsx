import { useState, useEffect, useRef, useCallback } from "react";
import { Loader2, Settings, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuotePrefill, prefillToParams, prefillToMessage } from "@/lib/quotePrefill";

type LeadSaveState =
  | { status: "idle" }
  | { status: "saving" }
  | { status: "saved"; reference: string; email: string }
  | { status: "error"; message: string };

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
  const [leadSave, setLeadSave] = useState<LeadSaveState>({ status: "idle" });
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isReadyRef = useRef(false);
  const prefill = useQuotePrefill();
  const prefillRef = useRef(prefill);
  prefillRef.current = prefill;

  // Persist the submitted quote as a lead, then surface a visible confirmation.
  const saveLead = useCallback(
    async (payload: Record<string, unknown>) => {
      const p = prefillRef.current;
      const email = String(payload.email || "");
      const quoteId = String(payload.quote_id || "");
      const reference = quoteId || crypto.randomUUID().slice(0, 8).toUpperCase();

      setLeadSave({ status: "saving" });
      const { error } = await supabase.from("leads_inbox").insert({
        source: "commercialpro_quote",
        external_id: quoteId || null,
        intent: "quote_request",
        confidence: 1,
        caller_email: email || null,
        caller_name: (payload.name as string) || null,
        caller_phone: (payload.phone as string) || null,
        caller_company: (payload.company as string) || null,
        summary:
          (payload.summary as string) ||
          `${p.category} • ${Math.round(p.sqft)} sq ft • ${p.tierLabel} (${p.tierDiscount}% off)`,
        next_action: "follow_up",
        raw: JSON.parse(JSON.stringify({ ...payload, prefill: p, reference })),
      });

      if (error) {
        setLeadSave({ status: "error", message: error.message });
        return;
      }
      setLeadSave({ status: "saved", reference, email });
    },
    []
  );


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
          void saveLead(data);
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onQuoteStarted, onQuoteUpdated, onQuoteSubmitted, quoteOrigin, saveLead]);

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

  // Visible confirmation once the quote request has been captured as a lead
  if (leadSave.status === "saved") {
    return (
      <div
        className={`bg-card border border-success/40 rounded-xl p-8 text-center shadow-lg ${className}`}
        role="status"
        aria-live="polite"
      >
        <div className="w-16 h-16 bg-success/15 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Quote request received
        </h3>
        <p className="text-muted-foreground mb-4">
          Your request is in our commercial lead inbox. A specialist will follow up
          {leadSave.email ? ` at ${leadSave.email}` : ""} within one business day.
        </p>
        <p className="text-sm text-muted-foreground">
          Reference: <span className="font-mono text-foreground">CP-{leadSave.reference}</span>
        </p>
        <Button variant="outline" className="mt-6" onClick={() => setLeadSave({ status: "idle" })}>
          Start another quote
        </Button>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {leadSave.status === "saving" && (
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center gap-2 rounded-lg bg-background/95 border border-border px-3 py-2 shadow-md">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <p className="text-sm text-foreground">Saving your quote request…</p>
        </div>
      )}
      {leadSave.status === "error" && (
        <div className="absolute top-3 left-3 right-3 z-20 flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/40 px-3 py-2 shadow-md">
          <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
          <p className="text-sm text-foreground">
            We couldn’t save your request ({leadSave.message}). Please call or email us and we’ll pick it up manually.
          </p>
        </div>
      )}
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
