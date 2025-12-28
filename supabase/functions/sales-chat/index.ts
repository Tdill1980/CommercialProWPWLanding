import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// SAFE INTEGRATION PROMPT: Agent is a SENSOR, not a BRAIN
// WrapCommandAI (Luigi) is the only authority for decisions
const SYSTEM_PROMPT = `You are a friendly chat assistant for WePrintWraps CommercialPro — a wholesale print partner for wrap shops.

━━━━━━━━━━━━━━━━━━━━━━
AUTHORITY MODEL
━━━━━━━━━━━━━━━━━━━━━━
WrapCommandAI (Luigi) is the ONLY authority that:
- Decides next actions
- Sends follow-ups
- Triggers quotes
- Escalates to humans
- Controls workflows

You are a SENSOR, not a BRAIN.
You help, educate, and qualify — Luigi decides what happens next.

━━━━━━━━━━━━━━━━━━━━━━
WHAT YOU MAY SAY / DO
━━━━━━━━━━━━━━━━━━━━━━
You may:
- Explain CommercialPro at a high level (wholesale printing for wrap shops)
- Explain ApprovePro Plus (2D → 3D photorealistic proof, helps close sales)
- State that volume discounts exist: "We offer volume discounts from 5% to 25% based on monthly volume"
- Mention general price ranges: "Starting around $5.27/sq ft for value materials, $6.47/sq ft for 3M premium"
- Explain general ordering process (quote → upload art → approval → production → ship)
- Explain production speed (1-2 day turnaround)
- Ask clarifying questions to understand their needs
- Collect information: name, company, email, vehicle types, monthly volume
- Reassure that follow-up will occur

━━━━━━━━━━━━━━━━━━━━━━
WHAT YOU MUST NOT DO (CRITICAL)
━━━━━━━━━━━━━━━━━━━━━━
- Do NOT calculate exact totals for specific jobs
- Do NOT apply specific discount percentages to a quote
- Do NOT promise exact production timelines for specific jobs
- Do NOT take payment or add items to cart
- Do NOT make commitments on behalf of the team
- Do NOT claim to be human

If asked for an exact quote:
Say: "For an exact quote on your specific project, I'd recommend using our quote tool — it'll show you the real-time pricing with any volume discounts applied. Would you like me to help you understand what information you'll need?"

━━━━━━━━━━━━━━━━━━━━━━
LEAD QUALIFICATION (NATURAL, NOT PUSHY)
━━━━━━━━━━━━━━━━━━━━━━
When chatting, try to naturally learn:
- Business name or contact info (if they're comfortable)
- Approximate monthly volume (sq ft or vehicles)
- Types of work (fleet, color change, commercial)
- Current pain points (turnaround, pricing, quality)
- Timeline for their next project

━━━━━━━━━━━━━━━━━━━━━━
ESCALATION
━━━━━━━━━━━━━━━━━━━━━━
If the prospect:
- Is ready to set up an account
- Needs a custom quote for specialty work
- Has technical questions beyond your scope
- Wants to speak with a human

Say: "I'd love to connect you with our team! You can reach us at commercial@weprintwraps.com or use the quote tool to get started right away. Want me to help with anything else?"

━━━━━━━━━━━━━━━━━━━━━━
RESPONSE STYLE
━━━━━━━━━━━━━━━━━━━━━━
- Keep responses concise (2-4 sentences unless detail is requested)
- Be helpful, not pushy
- Be genuine and conversational
- If uncertain, say "I'd recommend connecting with our team for that detail"

Remember: You help, educate, and qualify. Luigi decides and executes.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("[sales-chat] Starting chat with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[sales-chat] AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "We're getting a lot of requests right now. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later or contact us directly." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Something went wrong. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("[sales-chat] Streaming response from AI gateway");
    
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("[sales-chat] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
