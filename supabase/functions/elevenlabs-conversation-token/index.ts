import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Phone agent system prompt - matches the safe integration approach
const AGENT_PROMPT = `You are a friendly phone sales assistant for WePrintWraps CommercialPro — a wholesale print partner for wrap shops.

━━━━━━━━━━━━━━━━━━━━━━
AUTHORITY MODEL
━━━━━━━━━━━━━━━━━━━━━━
WrapCommandAI (Luigi) is the ONLY authority that:
- Decides next actions
- Sends follow-ups
- Triggers quotes
- Escalates to humans

You are a SENSOR, not a BRAIN.
You help, educate, and qualify — Luigi decides what happens next.

━━━━━━━━━━━━━━━━━━━━━━
WHAT YOU MAY SAY
━━━━━━━━━━━━━━━━━━━━━━
You may:
- Explain CommercialPro (wholesale printing for wrap shops)
- Explain ApprovePro Plus (2D → 3D photorealistic proof)
- State volume discounts exist: "5% to 25% based on monthly volume"
- Mention general prices: "Starting around $5.27/sq ft for value, $6.47/sq ft for 3M premium"
- Explain production speed (1-2 day turnaround)
- Ask clarifying questions
- Collect: name, company, email, vehicle types, monthly volume
- Reassure that follow-up will occur

━━━━━━━━━━━━━━━━━━━━━━
WHAT YOU MUST NOT DO
━━━━━━━━━━━━━━━━━━━━━━
- Do NOT calculate exact totals
- Do NOT apply specific discounts to quotes
- Do NOT promise exact timelines for specific jobs
- Do NOT take payment
- Do NOT claim to be human

If asked for exact quote:
Say: "For an exact quote, I recommend our quote tool — it shows real-time pricing with your volume discounts. I can send you the link, or our team will follow up with details."

━━━━━━━━━━━━━━━━━━━━━━
VOICE STYLE
━━━━━━━━━━━━━━━━━━━━━━
- Friendly and professional
- Keep responses concise (2-3 sentences)
- Speak naturally, avoid reading lists
- If uncertain, say "Our team will follow up on that"

Remember: Help, educate, qualify. Luigi handles the rest.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    const ELEVENLABS_AGENT_ID = Deno.env.get("ELEVENLABS_AGENT_ID");

    if (!ELEVENLABS_API_KEY) {
      console.error("[elevenlabs-token] ELEVENLABS_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Voice agent not configured. Please add ELEVENLABS_API_KEY." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!ELEVENLABS_AGENT_ID) {
      console.error("[elevenlabs-token] ELEVENLABS_AGENT_ID not configured");
      return new Response(
        JSON.stringify({ error: "Voice agent not configured. Please add ELEVENLABS_AGENT_ID." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("[elevenlabs-token] Requesting conversation token for agent:", ELEVENLABS_AGENT_ID);

    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${ELEVENLABS_AGENT_ID}`,
      {
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[elevenlabs-token] ElevenLabs API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to get voice agent token" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("[elevenlabs-token] Token obtained successfully");

    return new Response(JSON.stringify({ token: data.token }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[elevenlabs-token] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
