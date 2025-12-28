import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FollowUpRequest {
  lead_id: string;
  to_email: string;
  to_name?: string;
  intent: string;
  summary?: string;
  template?: "quote_followup" | "pricing_explainer" | "general_followup";
}

// Email templates
const templates = {
  quote_followup: {
    subject: "Your WePrintWraps Quote Request",
    html: (name: string, summary: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a365d;">Thanks for reaching out${name ? `, ${name}` : ''}!</h2>
        <p>We received your quote request and wanted to follow up personally.</p>
        ${summary ? `<p style="background: #f7fafc; padding: 16px; border-radius: 8px; color: #4a5568;"><strong>Your request:</strong> ${summary}</p>` : ''}
        <p>Ready to get your exact pricing? Use our instant quote tool:</p>
        <p style="text-align: center; margin: 24px 0;">
          <a href="https://weprintwraps.com/commercial" 
             style="background: #3182ce; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Get Your Quote →
          </a>
        </p>
        <p>Or simply reply to this email with any questions.</p>
        <p style="color: #718096; font-size: 14px; margin-top: 32px;">
          Best,<br>
          The WePrintWraps CommercialPro Team
        </p>
      </div>
    `,
  },
  pricing_explainer: {
    subject: "WePrintWraps Pricing Info You Requested",
    html: (name: string, _summary: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a365d;">Hi${name ? ` ${name}` : ''}!</h2>
        <p>Thanks for asking about our pricing. Here's a quick overview:</p>
        <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 8px 0;"><strong>3M 180CV3 Premium:</strong> Starting at $6.47/sq ft</p>
          <p style="margin: 8px 0;"><strong>Avery MPI 1105 Value:</strong> Starting at $5.27/sq ft</p>
          <p style="margin: 8px 0; color: #38a169;"><strong>Volume Discounts:</strong> Up to 25% off for 10,000+ sq ft/month</p>
        </div>
        <p>Get your exact pricing with our instant quote tool:</p>
        <p style="text-align: center; margin: 24px 0;">
          <a href="https://weprintwraps.com/commercial" 
             style="background: #3182ce; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Calculate Your Price →
          </a>
        </p>
        <p style="color: #718096; font-size: 14px; margin-top: 32px;">
          Best,<br>
          The WePrintWraps CommercialPro Team
        </p>
      </div>
    `,
  },
  general_followup: {
    subject: "Following Up From WePrintWraps",
    html: (name: string, summary: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a365d;">Hi${name ? ` ${name}` : ''}!</h2>
        <p>Thanks for reaching out to WePrintWraps CommercialPro.</p>
        ${summary ? `<p style="background: #f7fafc; padding: 16px; border-radius: 8px; color: #4a5568;">${summary}</p>` : ''}
        <p>We're here to help with your commercial wrap printing needs. Feel free to:</p>
        <ul>
          <li>Reply to this email with any questions</li>
          <li>Use our <a href="https://weprintwraps.com/commercial">instant quote tool</a></li>
          <li>Call us directly at (800) 555-0199</li>
        </ul>
        <p style="color: #718096; font-size: 14px; margin-top: 32px;">
          Best,<br>
          The WePrintWraps CommercialPro Team
        </p>
      </div>
    `,
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: FollowUpRequest = await req.json();
    const { lead_id, to_email, to_name, intent, summary, template } = body;

    if (!lead_id) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing lead_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Determine template based on intent
    let templateKey: keyof typeof templates = template || "general_followup";
    if (!template) {
      if (intent === "quote_request") templateKey = "quote_followup";
      else if (intent === "pricing_question") templateKey = "pricing_explainer";
    }

    const emailTemplate = templates[templateKey];
    const emailHtml = emailTemplate.html(to_name || "", summary || "");
    const emailSubject = emailTemplate.subject;

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    let emailSent = false;

    // Try to send email if we have Resend configured and a valid email
    if (RESEND_API_KEY && to_email && to_email.includes("@")) {
      try {
        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "WePrintWraps <onboarding@resend.dev>", // Will need real domain
            to: [to_email],
            subject: emailSubject,
            html: emailHtml,
          }),
        });

        if (resendResponse.ok) {
          emailSent = true;
          console.log("[mightymail-followup] Email sent to:", to_email);
        } else {
          const resendError = await resendResponse.text();
          console.log("[mightymail-followup] Resend error:", resendError);
        }
      } catch (err) {
        console.log("[mightymail-followup] Failed to send email:", err);
      }
    } else {
      console.log("[mightymail-followup] No RESEND_API_KEY or valid email, logging only");
      console.log("[mightymail-followup] Would send to:", to_email);
      console.log("[mightymail-followup] Subject:", emailSubject);
    }

    // Update lead status in database
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/leads_inbox?id=eq.${lead_id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            status: emailSent ? "followup_sent" : "new",
            followup_sent_at: emailSent ? new Date().toISOString() : null,
          }),
        });
        console.log("[mightymail-followup] Lead status updated");
      } catch (err) {
        console.log("[mightymail-followup] Failed to update lead:", err);
      }
    }

    // Notify owner (placeholder - could be Slack, SMS, etc.)
    const OWNER_NOTIFY_URL = Deno.env.get("OWNER_NOTIFY_URL");
    if (OWNER_NOTIFY_URL) {
      try {
        await fetch(OWNER_NOTIFY_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "new_lead",
            lead_id,
            intent,
            summary,
            email_sent: emailSent,
          }),
        });
      } catch {
        // Silent fail on notification
      }
    }

    return new Response(
      JSON.stringify({ 
        ok: true, 
        email_sent: emailSent,
        template_used: templateKey,
        lead_id 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[mightymail-followup] Error:", error);
    return new Response(
      JSON.stringify({ ok: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
