import { useState } from "react";
import { Copy, Check, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * PromoCodesSection
 *
 * Live WooCommerce fleet coupon codes with transparent breakdowns.
 * Display-only — the actual discount is applied by WooCommerce at checkout.
 */

const BASE_PRICE = 5.27;

const PROMO_CODES = [
  { code: "FLEET5", percent: 5, minSpend: 2635, minSqFt: 500 },
  { code: "FLEET10", percent: 10, minSpend: 5270, minSqFt: 1000 },
  { code: "FLEET15", percent: 15, minSpend: 7905, minSqFt: 1500 },
  { code: "FLEET20", percent: 20, minSpend: 13175, minSqFt: 2500, isBest: true },
];

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const PromoCodesSection = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied((c) => (c === code ? null : c)), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <section className="w-full bg-background py-16 border-y border-border">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-primary mb-3">
            <Tag className="h-3.5 w-3.5" />
            Fleet Promo Codes
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight mb-3">
            Apply your discount at checkout
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            These codes are live in our store. Enter the code at checkout once your order
            hits the minimum — the discount applies to the full order.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {PROMO_CODES.map((promo) => {
            const discountedPrice = BASE_PRICE * (1 - promo.percent / 100);
            const savings = promo.minSpend * (promo.percent / 100);

            return (
              <div
                key={promo.code}
                className={`relative rounded-xl border bg-card p-5 shadow-sm ${
                  promo.isBest ? "border-primary shadow-lg shadow-primary/10" : "border-border"
                }`}
              >
                {promo.isBest && (
                  <span className="absolute -top-2.5 right-4 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    Best value
                  </span>
                )}

                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="font-mono text-xl font-black text-foreground tracking-wide">
                      {promo.code}
                    </p>
                    <p className="text-sm font-semibold text-primary">{promo.percent}% off</p>
                  </div>
                  <Button
                    size="sm"
                    variant={promo.isBest ? "default" : "outline"}
                    onClick={() => copy(promo.code)}
                    aria-label={`Copy promo code ${promo.code}`}
                  >
                    {copied === promo.code ? (
                      <>
                        <Check className="h-4 w-4 mr-1.5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1.5" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>

                <dl className="space-y-2 text-sm border-t border-border pt-4">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Minimum order</dt>
                    <dd className="font-semibold text-foreground">{money(promo.minSpend)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Roughly</dt>
                    <dd className="font-medium text-foreground">
                      {promo.minSqFt.toLocaleString()}+ sq ft
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Effective rate</dt>
                    <dd className="font-medium text-foreground">
                      ${discountedPrice.toFixed(2)}/sq ft
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">You save at minimum</dt>
                    <dd className="font-bold text-primary">{money(savings)}</dd>
                  </div>
                </dl>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-8 max-w-2xl mx-auto">
          One code per order — codes don't stack. Minimums are calculated on the order subtotal
          at the ${BASE_PRICE.toFixed(2)}/sq ft base rate before shipping and taxes.
        </p>
      </div>
    </section>
  );
};

export default PromoCodesSection;
