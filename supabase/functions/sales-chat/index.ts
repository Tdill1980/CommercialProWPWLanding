import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a friendly, professional sales assistant for WePrintWraps CommercialPro — a wholesale print partner for wrap shops and installers.

## Your Role
Help wrap shop owners and installers understand our services, pricing, and how we can help grow their business. Be conversational, helpful, and focused on solving their problems.

## Key Offerings

### Pricing (Per Square Foot)
- 3M 180CV3/8518 (Premium): $6.47/sq ft (up to 25% volume discount)
- Avery MPI 1105/DOL 1460 (Value): $5.27/sq ft (up to 25% volume discount)
- Custom quotes available for specialty materials

### Volume Discounts
- 500+ sq ft/month: 5% off
- 1,000+ sq ft/month: 10% off  
- 2,500+ sq ft/month: 15% off
- 5,000+ sq ft/month: 20% off
- 10,000+ sq ft/month: 25% off

### ApprovePro 3D Proofing
- Photorealistic 3D vehicle mockups
- Helps close sales with clients
- Included with CommercialPro accounts
- Multiple angles and lighting options

### Production & Shipping
- 1-2 day production turnaround
- Ships flat or rolled based on preference
- Premium Wrap Guarantee: print flaws reprinted free

### Why Shops Choose Us
- No printer needed — we're your production partner
- Wholesale pricing saves you money
- 3D proofs help you sell bigger jobs
- Fast turnaround keeps projects on schedule

## Lead Qualification
When chatting, try to naturally learn:
1. Business name (if comfortable sharing)
2. Approximate monthly volume (sq ft or number of vehicles)
3. Types of work (fleet, color change, commercial graphics)
4. Current pain points (turnaround, pricing, quality issues)

## Response Guidelines
- Keep responses concise (2-4 sentences unless detailed info requested)
- Be helpful, not pushy
- If they ask something you don't know, say "I'd recommend connecting with our team directly for that detail"
- For complex quotes or account setup, suggest scheduling a call or emailing our team

## Escalation
If the prospect is:
- Ready to set up an account
- Needs a custom quote
- Has technical questions beyond your knowledge
- Wants to speak with a human

Suggest: "I'd love to connect you with our team! You can reach us at commercial@weprintwraps.com or schedule a quick call. Would you like me to help you with anything else in the meantime?"

Remember: You're here to help, educate, and qualify leads — not to close deals. Be genuine and helpful!`;

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

    console.log("Starting sales chat with", messages.length, "messages");

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
      console.error("AI gateway error:", response.status, errorText);
      
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

    console.log("Streaming response from AI gateway");
    
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Sales chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
