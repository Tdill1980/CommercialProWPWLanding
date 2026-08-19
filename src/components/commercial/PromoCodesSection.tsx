import { useMemo, useState } from "react";
import { Copy, Check, Tag, Calculator, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * PromoCodesSection
 *
 * Live WooCommerce fleet coupon codes with transparent breakdowns,
 * plus a live order-cost estimator driven by sq ft or wrap size presets.
 * Display-only — the actual discount is applied by WooCommerce at checkout.
 */

const BASE_PRICE = 5.27;

const PROMO_CODES = [
  { code: "FLEET5", percent: 5, minSpend: 2635, minSqFt: 500 },
  { code: "FLEET10", percent: 10, minSpend: 5270, minSqFt: 1000 },
  { code: "FLEET15", percent: 15, minSpend: 7905, minSqFt: 1500 },
  { code: "FLEET20", percent: 20, minSpend: 13175, minSqFt: 2500, isBest: true },
];

/** Typical printed coverage per unit, in sq ft. */
const WRAP_SIZES = [
  { id: "partial", label: "Partial / spot graphics", sqFt: 120 },
  { id: "car", label: "Car full wrap", sqFt: 250 },
  { id: "van", label: "Cargo van full wrap", sqFt: 300 },
  { id: "sprinter", label: "Sprinter high-roof", sqFt: 400 },
  { id: "boxtruck", label: "Box truck", sqFt: 600 },
  { id: "trailer", label: "53' trailer", sqFt: 1000 },
];

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const PromoCodesSection = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const [sizeId, setSizeId] = useState<string>("van");
  const [qty, setQty] = useState<number>(4);
  const [customSqFt, setCustomSqFt] = useState<number | null>(null);

  const size = WRAP_SIZES.find((s) => s.id === sizeId) ?? WRAP_SIZES[2];
  const sqFt = customSqFt ?? size.sqFt * qty;
  const subtotal = sqFt * BASE_PRICE;

  const best = useMemo(
    () =>
      [...PROMO_CODES]
        .filter((p) => subtotal >= p.minSpend)
        .sort((a, b) => b.percent - a.percent)[0] ?? null,
    [subtotal]
  );

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
    <section className="w-full bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 py-16 border-y border-border">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-blue-300 mb-3">
            <Tag className="h-3.5 w-3.5" />
            Fleet Promo Codes
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
            Apply your discount at checkout
          </h2>
          <p className="text-blue-100/80 max-w-2xl mx-auto">
            These codes are live in our store. Enter the code at checkout once your order
            hits the minimum — the discount applies to the full order.
          </p>
        </div>

        {/* Live order estimator */}
        <div className="rounded-2xl border-2 border-border bg-card shadow-2xl shadow-black/40 p-5 md:p-6 mb-8">
          <div className="flex items-center gap-2 mb-5">
            <Calculator className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Your order breakdown
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-5">
            <div>
              <label htmlFor="promo-size" className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Wrap size
              </label>
              <select
                id="promo-size"
                value={sizeId}
                onChange={(e) => {
                  setSizeId(e.target.value);
                  setCustomSqFt(null);
                }}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
              >
                {WRAP_SIZES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label} · {s.sqFt} sq ft
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="promo-qty" className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Vehicles
              </label>
              <input
                id="promo-qty"
                type="number"
                min={1}
                max={100}
                value={qty}
                onChange={(e) => {
                  setQty(Math.max(1, Math.min(100, Number(e.target.value) || 1)));
                  setCustomSqFt(null);
                }}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
              />
            </div>

            <div>
              <label htmlFor="promo-sqft" className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Total sq ft
              </label>
              <input
                id="promo-sqft"
                type="number"
                min={1}
                max={50000}
                value={sqFt}
                onChange={(e) =>
                  setCustomSqFt(Math.max(1, Math.min(50000, Number(e.target.value) || 1)))
                }
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm font-semibold text-foreground"
              />
            </div>
          </div>

          <input
            type="range"
            min={100}
            max={15000}
            step={50}
            value={Math.min(sqFt, 15000)}
            onChange={(e) => setCustomSqFt(Number(e.target.value))}
            aria-label="Total square footage"
            className="w-full accent-primary mb-5"
          />

          <dl className="grid sm:grid-cols-4 gap-3 text-sm">
            <div className="rounded-lg bg-muted/60 border border-border p-3">
              <dt className="text-xs text-muted-foreground">Subtotal</dt>
              <dd className="font-black text-foreground text-lg">{money(subtotal)}</dd>
            </div>
            <div className="rounded-lg bg-muted/60 border border-border p-3">
              <dt className="text-xs text-muted-foreground">Discount</dt>
              <dd className="font-black text-lg text-primary">
                {best ? `-${money(subtotal * (best.percent / 100))}` : "—"}
              </dd>
            </div>
            <div className="rounded-lg bg-muted/60 border border-border p-3">
              <dt className="text-xs text-muted-foreground">Order total</dt>
              <dd className="font-black text-foreground text-lg">
                {money(subtotal * (1 - (best?.percent ?? 0) / 100))}
              </dd>
            </div>
            <div className="rounded-lg bg-primary/10 border-2 border-primary/40 p-3">
              <dt className="text-xs text-muted-foreground">Effective rate</dt>
              <dd className="font-black text-primary text-lg">
                ${(BASE_PRICE * (1 - (best?.percent ?? 0) / 100)).toFixed(2)}
                <span className="text-xs font-semibold">/sq ft</span>
              </dd>
            </div>
          </dl>

          <p className="text-xs text-muted-foreground mt-4">
            {best ? (
              <>
                Best code for this order:{" "}
                <span className="font-mono font-bold text-foreground">{best.code}</span> (
                {best.percent}% off).
              </>
            ) : (
              <>
                Add{" "}
                <span className="font-semibold text-foreground">
                  {money(PROMO_CODES[0].minSpend - subtotal)}
                </span>{" "}
                to unlock FLEET5.
              </>
            )}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {PROMO_CODES.map((promo) => {
            const qualifies = subtotal >= promo.minSpend;
            const isBestForOrder = best?.code === promo.code;
            const discountedPrice = BASE_PRICE * (1 - promo.percent / 100);
            const savings = qualifies
              ? subtotal * (promo.percent / 100)
              : promo.minSpend * (promo.percent / 100);

            return (
              <div
                key={promo.code}
                onClick={() =>
                  trackEvent("promo_code_click", {
                    promo_code: promo.code,
                    percent_off: promo.percent,
                    qualifies,
                    order_subtotal: Math.round(subtotal),
                    sq_ft: sqFt,
                  })
                }
                className={`relative rounded-xl border-2 bg-card p-5 transition-shadow ${
                  isBestForOrder
                    ? "border-primary shadow-xl shadow-primary/30 ring-2 ring-primary/30"
                    : qualifies
                      ? "border-border shadow-lg shadow-black/40"
                      : "border-border shadow-lg shadow-black/40 opacity-70"
                }`}
              >
                {isBestForOrder ? (
                  <span className="absolute -top-2.5 right-4 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md shadow-black/30">
                    Best for your order
                  </span>
                ) : promo.isBest ? (
                  <span className="absolute -top-2.5 right-4 bg-muted text-muted-foreground border border-border text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    Best value
                  </span>
                ) : null}

                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="font-mono text-xl font-black text-foreground tracking-wide">
                      {promo.code}
                    </p>
                    <p className="text-sm font-semibold text-primary">{promo.percent}% off</p>
                  </div>
                  <Button
                    size="sm"
                    variant={isBestForOrder ? "default" : "outline"}
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
                    <dt className="text-muted-foreground">
                      {qualifies ? "You save on this order" : "You save at minimum"}
                    </dt>
                    <dd className="font-bold text-primary">{money(savings)}</dd>
                  </div>
                </dl>

                {!qualifies && (
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    {money(promo.minSpend - subtotal)} more to unlock
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-xs text-blue-100/70 text-center mt-8 max-w-2xl mx-auto">
          One code per order — codes don't stack. Minimums are calculated on the order subtotal
          at the ${BASE_PRICE.toFixed(2)}/sq ft base rate before shipping and taxes.
        </p>
      </div>
    </section>
  );
};

export default PromoCodesSection;
