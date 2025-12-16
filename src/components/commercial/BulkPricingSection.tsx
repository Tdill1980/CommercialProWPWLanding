import { useState } from "react";
import { Check, Calculator, TrendingDown } from "lucide-react";

/**
 * BulkPricingSection
 * 
 * Interactive bulk pricing selector showing volume discounts.
 * Front-end only — does NOT affect actual checkout pricing.
 * 
 * Standalone, modular component for WePrintWraps CommercialPro.
 */

const VOLUME_TIERS = [
  { id: "tier1", label: "250–499 sq ft", discount: 5, minSqFt: 250 },
  { id: "tier2", label: "500–999 sq ft", discount: 10, minSqFt: 500 },
  { id: "tier3", label: "1,000–2,499 sq ft", discount: 15, minSqFt: 1000 },
  { id: "tier4", label: "2,500+ sq ft", discount: 20, minSqFt: 2500 },
];

const BASE_PRICE = 5.27;

export const BulkPricingSection = () => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const activeTier = VOLUME_TIERS.find((t) => t.id === selectedTier);
  const discountedPrice = activeTier
    ? BASE_PRICE * (1 - activeTier.discount / 100)
    : BASE_PRICE;
  const savings = activeTier
    ? (BASE_PRICE - discountedPrice) * activeTier.minSqFt
    : 0;

  return (
    <section className="w-full bg-background py-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-medium tracking-widest uppercase text-primary mb-3">
            Volume Pricing
          </span>
          <h2 className="text-3xl font-semibold text-foreground mb-4">
            Bulk & Fleet Pricing
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Transparent volume discounts. No quote required to see your savings.
          </p>
        </div>

        {/* Base Price */}
        <div className="bg-muted/40 rounded-lg p-6 mb-8 text-center border border-border">
          <p className="text-sm text-muted-foreground mb-1">Base Price</p>
          <p className="text-2xl font-semibold text-foreground">
            ${BASE_PRICE.toFixed(2)}{" "}
            <span className="text-base font-normal text-muted-foreground">
              / sq ft
            </span>
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Premium 3M IJ180 (Avery-equivalent pricing)
          </p>
        </div>

        {/* Volume Tiers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {VOLUME_TIERS.map((tier) => {
            const isSelected = selectedTier === tier.id;
            return (
              <button
                key={tier.id}
                onClick={() => setSelectedTier(isSelected ? null : tier.id)}
                className={`relative p-5 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? "border-primary bg-secondary/50"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2">
                    <Check className="w-4 h-4 text-primary" />
                  </span>
                )}
                <p className="text-sm font-medium text-foreground mb-1">
                  {tier.label}
                </p>
                <p className="text-xl font-semibold text-primary">
                  {tier.discount}% off
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Tier Details */}
        {activeTier && (
          <div className="bg-secondary/30 rounded-lg p-6 border border-primary/20 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Your Volume Price
                </p>
                <p className="text-3xl font-semibold text-foreground">
                  ${discountedPrice.toFixed(2)}{" "}
                  <span className="text-base font-normal text-muted-foreground">
                    / sq ft
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-3 text-success">
                <TrendingDown className="w-5 h-5" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Minimum Estimated Savings
                  </p>
                  <p className="text-xl font-semibold">
                    ${savings.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Guarantee Note */}
        <p className="text-center text-sm text-muted-foreground mt-8 flex items-center justify-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-success" />
          Includes Premium Wrap Guarantee — print flaws reprinted at no cost.
        </p>

        {/* Disclaimer */}
        <p className="text-center text-xs text-muted-foreground/70 mt-4">
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