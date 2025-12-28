import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// This function extracts structured lead data from a chat conversation
// and sends it to WrapCommandAI (Luigi) for processing
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, session_id } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ ok: false, error: "No messages provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("[extract-chat-lead] Processing", messages.length, "messages");

    // Use tool calling to extract structured data
    const extractionPrompt = `Analyze this chat conversation and extract structured lead information.
Be conservative: only include information that was explicitly shared.
If something wasn't mentioned, leave it null.
For intent, choose the most accurate category based on what the user was asking about.
For confidence, rate 0.0-1.0 based on how clear their intent was.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: extractionPrompt },
          ...messages,
          { role: "user", content: "Extract the lead information from this conversation into the structured format using the extract_lead_info tool." }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_lead_info",
              description: "Extract structured lead information from the chat conversation",
              parameters: {
                type: "object",
                properties: {
                  contact: {
                    type: "object",
                    properties: {
                      name: { type: "string", description: "Contact name if provided" },
                      company: { type: "string", description: "Company name if provided" },
                      phone: { type: "string", description: "Phone number if provided" },
                      email: { type: "string", description: "Email if provided" }
                    }
                  },
                  intent: { 
                    type: "string", 
                    enum: ["quote_request", "reorder", "pricing_question", "info_only", "unknown"],
                    description: "The primary intent of the conversation"
                  },
                  confidence: { 
                    type: "number", 
                    description: "Confidence in the intent classification (0.0-1.0)" 
                  },
                  details: {
                    type: "object",
                    properties: {
                      vehicle_type: { type: "string", description: "Type of vehicle mentioned" },
                      vehicles_count: { type: "string", description: "Number of vehicles mentioned" },
                      sqft_estimate: { type: "string", description: "Square footage estimate" },
                      timeline: { type: "string", description: "Project timeline mentioned" },
                      repeat_customer: { type: "boolean", description: "If they mentioned being a returning customer" }
                    }
                  },
                  summary: { 
                    type: "string", 
                    description: "One sentence summary of what the user wants" 
                  }
                },
                required: ["intent", "confidence", "summary"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "extract_lead_info" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[extract-chat-lead] AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ ok: false, error: "Failed to extract lead info" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await response.json();
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      console.error("[extract-chat-lead] No tool call in response");
      return new Response(
        JSON.stringify({ ok: false, error: "Failed to extract structured data" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let extractedData;
    try {
      extractedData = JSON.parse(toolCall.function.arguments);
    } catch {
      console.error("[extract-chat-lead] Failed to parse tool arguments");
      return new Response(
        JSON.stringify({ ok: false, error: "Failed to parse extracted data" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Determine action based on intent and confidence
    const confidence = extractedData.confidence ?? 0;
    let action = "log_only";
    
    if (confidence < 0.6) {
      action = "human_review";
    } else {
      switch (extractedData.intent) {
        case "quote_request":
          action = "send_quote_followup";
          break;
        case "pricing_question":
          action = "send_pricing_explainer";
          break;
        case "reorder":
          action = "open_command_center";
          break;
        case "info_only":
          action = "log_only";
          break;
        default:
          action = "human_review";
      }
    }

    // Build the payload for Luigi
    const luigiPayload = {
      source: "commercialpro_chat",
      action,
      payload: {
        interaction_id: session_id || crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        contact: extractedData.contact || {},
        intent: extractedData.intent,
        confidence: extractedData.confidence,
        details: extractedData.details || {},
        summary: extractedData.summary
      }
    };

    console.log("[extract-chat-lead] Extracted lead:", luigiPayload);

    // Persist to leads_inbox (optional)
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/leads_inbox`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            source: "chat",
            external_id: luigiPayload.payload.interaction_id,
            intent: extractedData.intent,
            confidence: extractedData.confidence ?? 0,
            caller_name: extractedData.contact?.name ?? null,
            caller_phone: extractedData.contact?.phone ?? null,
            caller_email: extractedData.contact?.email ?? null,
            caller_company: extractedData.contact?.company ?? null,
            summary: extractedData.summary ?? null,
            raw: luigiPayload,
            next_action: action,
          }),
        });
        console.log("[extract-chat-lead] Saved to leads_inbox");
      } catch (err) {
        console.log("[extract-chat-lead] leads_inbox insert failed:", err);
      }
    }

    // Hand off to Luigi
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
          body: JSON.stringify(luigiPayload),
        });
        console.log("[extract-chat-lead] Luigi handoff status:", luigiRes.status);
      } catch (err) {
        console.log("[extract-chat-lead] Luigi handoff failed:", err);
      }
    }

    return new Response(
      JSON.stringify({ ok: true, lead: luigiPayload, action }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[extract-chat-lead] Error:", error);
    return new Response(
      JSON.stringify({ ok: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
