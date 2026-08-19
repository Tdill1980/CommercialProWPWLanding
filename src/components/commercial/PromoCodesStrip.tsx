import { useState } from "react";
import { Check, Copy, Tag } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

/**
 * Compact above-the-fold fleet promo code strip.
 * Full breakdown + estimator lives in <PromoCodesSection /> (#promo-codes).
 */

const CODES = [
  { code: "FLEET5", percent: 5, minSpend: 2635 },
  { code: "FLEET10", percent: 10, minSpend: 5270 },
  { code: "FLEET15", percent: 15, minSpend: 7905 },
  { code: "FLEET20", percent: 20, minSpend: 13175 },
];

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const PromoCodesStrip = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (code: string, percent: number) => {
    trackEvent("promo_code_copy", { promo_code: code, percent_off: percent, source: "hero_strip" });
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied((c) => (c === code ? null : c)), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <section
      aria-label="Fleet promo codes"
      className="w-full overflow-x-hidden border-b border-border bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <Tag className="h-4 w-4 text-blue-300 shrink-0" />
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-blue-200">
              CommercialPro Perks · Fleet Codes
            </span>
          </div>

          <div className="flex-1 min-w-0 grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
            {CODES.map(({ code, percent, minSpend }) => (
              <button
                key={code}
                type="button"
                onClick={() => copy(code, percent)}
                className="group min-w-0 flex items-center justify-between gap-2 rounded-lg border border-blue-400/40 bg-white/10 px-2.5 py-2 text-left backdrop-blur-sm transition-colors hover:border-blue-300 hover:bg-white/20"
              >
                <span className="min-w-0">
                  <span className="block text-xs sm:text-sm font-black text-white truncate">
                    {code}
                  </span>
                  <span className="block text-[10px] sm:text-[11px] text-blue-200/90 truncate">
                    {percent}% off · {money(minSpend)}+
                  </span>
                </span>
                {copied === code ? (
                  <Check className="h-3.5 w-3.5 text-emerald-300 shrink-0" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-blue-200 shrink-0" />
                )}
              </button>
            ))}
          </div>

          <a
            href="#promo-codes"
            className="shrink-0 text-xs font-semibold text-blue-200 underline underline-offset-4 hover:text-white"
          >
            See breakdown
          </a>
        </div>
      </div>
    </section>
  );
};

export default PromoCodesStrip;
