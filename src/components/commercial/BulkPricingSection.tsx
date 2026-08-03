import { useState, useMemo } from "react";
import { Check, TrendingDown, Calculator, Ruler, DollarSign, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import premiumGuaranteeBadge from "@/assets/premium-wrap-guarantee-gold.png";

/**
 * BulkPricingSection
 * 
 * Professional volume pricing display with interactive calculator.
 * Shows actual discounted prices per tier with real-time calculation.
 * Front-end only — does NOT affect actual checkout pricing.
 */

const BASE_PRICE = 5.27;

const VOLUME_TIERS = [
  { label: "Under 250 sq ft", minSqFt: 0, maxSqFt: 249, discount: 0 },
  { label: "250–499 sq ft", minSqFt: 250, maxSqFt: 499, discount: 5 },
  { label: "500–999 sq ft", minSqFt: 500, maxSqFt: 999, discount: 10 },
  { label: "1,000–2,499 sq ft", minSqFt: 1000, maxSqFt: 2499, discount: 15 },
  { label: "2,500+ sq ft", minSqFt: 2500, maxSqFt: Infinity, discount: 20, isBest: true },
];

export const BulkPricingSection = () => {
  const [sqftInput, setSqftInput] = useState<string>("500");

  const calculations = useMemo(() => {
    const sqft = parseFloat(sqftInput) || 0;
    const activeTier = VOLUME_TIERS.find(
      (tier) => sqft >= tier.minSqFt && sqft <= tier.maxSqFt
    ) || VOLUME_TIERS[0];

    const discountedPrice = BASE_PRICE * (1 - activeTier.discount / 100);
    const baseTotal = sqft * BASE_PRICE;
    const discountedTotal = sqft * discountedPrice;
    const totalSavings = baseTotal - discountedTotal;

    const nextTier = VOLUME_TIERS.find((tier) => tier.minSqFt > sqft);
    const sqftToNextTier = nextTier ? Math.ceil(nextTier.minSqFt - sqft) : 0;

    return {
      sqft,
      activeTier,
      nextTier,
      sqftToNextTier,
      discountedPrice,
      baseTotal,
      discountedTotal,
      totalSavings,
    };
  }, [sqftInput]);

  const bestTier = VOLUME_TIERS[VOLUME_TIERS.length - 1];
  const bestPrice = BASE_PRICE * (1 - bestTier.discount / 100);

  return (
    <section className="w-full bg-gradient-to-b from-secondary/60 via-card to-card py-20 border-y border-border">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-3">
            Volume Discounts
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-3">
            Save up to 20% on bulk orders
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transparent volume discounts. No quote required to see your savings.
          </p>
          <div className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-5 rounded-full border border-border bg-background px-5 py-2.5">
            <span className="text-sm text-muted-foreground">
              Base <span className="font-semibold text-foreground">${BASE_PRICE.toFixed(2)}</span>/sq ft
            </span>
            <span className="text-muted-foreground/40">→</span>
            <span className="text-sm text-muted-foreground">
              As low as{" "}
              <span className="text-lg font-bold text-success">${bestPrice.toFixed(2)}</span>/sq ft
              <span className="ml-1">at {bestTier.label.toLowerCase()}</span>
            </span>
          </div>
        </div>


        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Interactive Calculator */}
          <div className="bg-background border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                <Calculator className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Savings Calculator</h3>
                <p className="text-xs text-muted-foreground">Enter your project size</p>
              </div>
            </div>

            {/* Input */}
            <div className="mb-6">
              <label className="text-sm text-muted-foreground mb-2 block">
                Project Size (sq ft)
              </label>
              <div className="relative">
                <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="number"
                  value={sqftInput}
                  onChange={(e) => setSqftInput(e.target.value)}
                  className="pl-10 pr-16 h-12 text-lg font-medium"
                  placeholder="500"
                  min="0"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  sq ft
                </span>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              {/* Your Tier */}
              <div className="bg-secondary/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Your Volume Tier</span>
                  {calculations.activeTier.discount > 0 && (
                    <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded">
                      {calculations.activeTier.discount}% OFF
                    </span>
                  )}
                </div>
                <p className="text-lg font-semibold text-foreground">{calculations.activeTier.label}</p>
              </div>

              {/* Your Price */}
              <div className="bg-secondary/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Your Price Per Sq Ft</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-foreground">${calculations.discountedPrice.toFixed(2)}</p>
                  {calculations.activeTier.discount > 0 && (
                    <span className="text-muted-foreground line-through text-base">
                      ${BASE_PRICE.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Total Savings */}
              {calculations.totalSavings > 0 && (
                <div className="bg-success/10 rounded-lg p-4 border border-success/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-success" />
                    <span className="text-sm text-success">Your Total Savings</span>
                  </div>
                  <p className="text-2xl font-bold text-success">
                    ${calculations.totalSavings.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    on {calculations.sqft.toLocaleString()} sq ft order
                  </p>
                </div>
              )}

              {/* Next Tier Nudge */}
              {calculations.nextTier && calculations.sqft > 0 && (
                <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <TrendingDown className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">
                    Add{" "}
                    <span className="font-semibold">
                      {calculations.sqftToNextTier.toLocaleString()} sq ft
                    </span>{" "}
                    to unlock{" "}
                    <span className="font-semibold text-primary">
                      {calculations.nextTier.discount}% off
                    </span>{" "}
                    at ${(BASE_PRICE * (1 - calculations.nextTier.discount / 100)).toFixed(2)}/sq ft
                  </p>
                </div>
              )}

              {/* Estimated Total */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Estimated Total</span>
                  <span className="text-xl font-bold text-foreground">
                    ${calculations.discountedTotal.toFixed(2)}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Right: Pricing Table */}
          <div className="bg-background border border-border rounded-xl p-6">
            {/* Base Price Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <TrendingDown className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Base Price</p>
                <p className="text-xl font-semibold text-foreground">
                  ${BASE_PRICE.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">/ sq ft</span>
                </p>
              </div>
            </div>

            {/* Volume Tiers */}
            <div className="space-y-0">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                Volume Tiers
              </p>

              {VOLUME_TIERS.filter(t => t.discount > 0).map((tier, index) => {
                const discountedPrice = BASE_PRICE * (1 - tier.discount / 100);
                const isActive = calculations.activeTier.label === tier.label;
                
                return (
                  <div
                    key={tier.label}
                    className={`flex items-center justify-between py-3 px-3 -mx-3 rounded-lg transition-colors ${
                      isActive 
                        ? "bg-primary/10 border border-primary/20" 
                        : index < VOLUME_TIERS.filter(t => t.discount > 0).length - 1 
                          ? "border-b border-border/50" 
                          : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${isActive ? "bg-primary" : "bg-muted-foreground/30"}`} />
                      <span className={`text-sm ${isActive ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                        {tier.label}
                      </span>
                      {tier.isBest && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide bg-success text-success-foreground px-2 py-0.5 rounded">
                          Best
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-sm font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                        {tier.discount}% off
                      </span>
                      <span className={`text-sm font-semibold ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                        ${discountedPrice.toFixed(2)}/sq ft
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Guarantee */}
            <div className="flex items-start gap-3 bg-secondary/50 rounded-lg p-4 mt-6">
              <img 
                src={premiumGuaranteeBadge} 
                alt="Premium Wrap Guarantee" 
                className="h-12 w-auto flex-shrink-0"
              />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Premium Wrap Guarantee
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Print flaws reprinted at no cost.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-muted-foreground/70 mt-6">
          This calculator is for estimation only. Final pricing confirmed at checkout or via{" "}
          <a href="mailto:hello@weprintwraps.com" className="text-primary hover:underline">
            hello@weprintwraps.com
          </a>
        </p>
      </div>
    </section>
  );
};

export default BulkPricingSection;
