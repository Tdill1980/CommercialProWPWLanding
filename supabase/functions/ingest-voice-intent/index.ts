import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-voice-ingest-secret",
};

type VoiceIntentPayload = {
  source: "ai_phone_agent";
  call_id: string;
  timestamp?: string;
  caller?: {
    name?: string;
    phone?: string;
    email?: string;
    company?: string;
  };
  intent: "quote_request" | "reorder" | "pricing_question" | "info_only" | "unknown";
  confidence?: number;
  details?: {
    vehicle_type?: string;
    vehicles_count?: string | number;
    sqft_estimate?: string | number;
    timeline?: string;
    repeat_customer?: boolean;
  };
  summary?: string;
};

function json(resBody: unknown, status = 200) {
  return new Response(JSON.stringify(resBody), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function bad(msg: string) {
  return json({ ok: false, error: msg }, 400);
}

function routeIntent(p: VoiceIntentPayload): string {
  const conf = typeof p.confidence === "number" ? p.confidence : 0.0;

  if (conf < 0.6) return "human_review";

  switch (p.intent) {
    case "quote_request":
      return "send_quote_followup";
    case "pricing_question":
      return "send_pricing_explainer";
    case "reorder":
      return "open_command_center";
    case "info_only":
      return "log_only";
    default:
      return "human_review";
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return bad("POST only");
  }

  let payload: VoiceIntentPayload;
  try {
    payload = await req.json();
  } catch {
    return bad("Invalid JSON");
  }

  if (!payload || payload.source !== "ai_phone_agent") {
    return bad("Invalid source");
  }
  if (!payload.call_id) {
    return bad("Missing call_id");
  }
  if (!payload.intent) {
    return bad("Missing intent");
  }

  // Optional shared secret to prevent random posts
  const expected = Deno.env.get("VOICE_INGEST_SECRET");
  if (expected) {
    const provided = req.headers.get("x-voice-ingest-secret");
    if (!provided || provided !== expected) {
      return json({ ok: false, error: "Unauthorized" }, 401);
    }
  }

  const action = routeIntent(payload);

  console.log("[ingest-voice-intent] Received call:", {
    call_id: payload.call_id,
    intent: payload.intent,
    confidence: payload.confidence,
    action,
  });

  // Persist call to leads_inbox
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  let leadId: string | null = null;

  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/leads_inbox`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          source: "phone",
          external_id: payload.call_id,
          intent: payload.intent,
          confidence: payload.confidence ?? 0,
          caller_name: payload.caller?.name ?? null,
          caller_phone: payload.caller?.phone ?? null,
          caller_email: payload.caller?.email ?? null,
          caller_company: payload.caller?.company ?? null,
          summary: payload.summary ?? null,
          raw: payload,
          next_action: action,
        }),
      });
      
      if (insertRes.ok) {
        const inserted = await insertRes.json();
        leadId = inserted[0]?.id;
        console.log("[ingest-voice-intent] Lead created:", leadId);
      } else {
        console.log("[ingest-voice-intent] leads_inbox insert failed:", insertRes.status);
      }
    } catch (err) {
      console.log("[ingest-voice-intent] leads_inbox insert error:", err);
    }

    // Trigger MightyMail follow-up if we have an email and it's a follow-up action
    if (leadId && payload.caller?.email && 
        (action === "send_quote_followup" || action === "send_pricing_explainer")) {
      try {
        const followupRes = await fetch(`${SUPABASE_URL}/functions/v1/mightymail-followup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          },
          body: JSON.stringify({
            lead_id: leadId,
            to_email: payload.caller.email,
            to_name: payload.caller.name,
            intent: payload.intent,
            summary: payload.summary,
          }),
        });
        console.log("[ingest-voice-intent] MightyMail triggered:", followupRes.status);
      } catch (err) {
        console.log("[ingest-voice-intent] MightyMail failed:", err);
      }
    }
  }

  // Hand off to Luigi (WrapCommandAI brain)
  const LUIGI_INGEST_URL = Deno.env.get("LUIGI_INGEST_URL");
  const LUIGI_INGEST_SECRET = Deno.env.get("LUIGI_INGEST_SECRET");

  if (LUIGI_INGEST_URL) {
    try {
      const luigiRes = await fetch(LUIGI_INGEST_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(LUIGI_INGEST_SECRET ? { "x-luigi-secret": LUIGI_INGEST_SECRET } : {}),
        },
        body: JSON.stringify({
          source: "commercialpro_phone",
          action,
          payload,
          lead_id: leadId,
        }),
      });
      console.log("[ingest-voice-intent] Luigi handoff status:", luigiRes.status);
    } catch (err) {
      console.log("[ingest-voice-intent] Luigi handoff failed:", err);
    }
  } else {
    console.log("[ingest-voice-intent] LUIGI_INGEST_URL not set, skipping handoff");
  }

  return json({ ok: true, routed_action: action, lead_id: leadId });
});
