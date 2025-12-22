import { Check, TrendingDown } from "lucide-react";

/**
 * BulkPricingSection
 * 
 * Professional volume pricing display with clean table format.
 * Shows actual discounted prices per tier.
 * Front-end only — does NOT affect actual checkout pricing.
 * 
 * Standalone, modular component for WePrintWraps CommercialPro.
 */

const BASE_PRICE = 5.27;

const VOLUME_TIERS = [
  { label: "250–499 sq ft", discount: 5 },
  { label: "500–999 sq ft", discount: 10 },
  { label: "1,000–2,499 sq ft", discount: 15 },
  { label: "2,500+ sq ft", discount: 20, isBest: true },
];

export const BulkPricingSection = () => {
  return (
    <section className="w-full bg-card py-16">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header - matching PricingUpdateExplainer style */}
        <div className="text-center mb-8">
          <span className="inline-block text-xs font-medium tracking-widest uppercase text-primary mb-3">
            Volume Discounts
          </span>
          <h2 className="text-3xl font-semibold text-foreground mb-2">
            Save up to 20% on bulk orders
          </h2>
          <p className="text-muted-foreground">
            Transparent volume discounts. No quote required to see your savings.
          </p>
        </div>

        {/* Pricing Card - matching PricingUpdateExplainer container */}
        <div className="bg-background border border-border rounded-xl p-8">
          {/* Base Price Header */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <TrendingDown className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Base Price</p>
              <p className="text-2xl font-semibold text-foreground">
                ${BASE_PRICE.toFixed(2)}{" "}
                <span className="text-base font-normal text-muted-foreground">
                  / sq ft
                </span>
              </p>
            </div>
            <span className="ml-auto text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">
              Premium 3M IJ180
            </span>
          </div>

          {/* Volume Tiers Table */}
          <div className="space-y-0">
            {/* Table Header */}
            <div className="grid grid-cols-3 gap-4 pb-3 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <span>Volume</span>
              <span className="text-center">Discount</span>
              <span className="text-right">Your Price</span>
            </div>

            {/* Tier Rows */}
            {VOLUME_TIERS.map((tier, index) => {
              const discountedPrice = BASE_PRICE * (1 - tier.discount / 100);
              const isLast = index === VOLUME_TIERS.length - 1;
              
              return (
                <div
                  key={tier.label}
                  className={`grid grid-cols-3 gap-4 py-4 items-center ${
                    !isLast ? "border-b border-border/50" : ""
                  } ${tier.isBest ? "bg-success/5 -mx-4 px-4 rounded-lg" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {tier.label}
                    </span>
                    {tier.isBest && (
                      <span className="text-[10px] font-semibold uppercase tracking-wide bg-success text-success-foreground px-2 py-0.5 rounded">
                        Best Value
                      </span>
                    )}
                  </div>
                  <span className="text-center text-sm font-semibold text-primary">
                    {tier.discount}% off
                  </span>
                  <span className="text-right text-lg font-semibold text-foreground">
                    ${discountedPrice.toFixed(2)}
                    <span className="text-xs font-normal text-muted-foreground ml-1">
                      /sq ft
                    </span>
                  </span>
                </div>
              );
            })}
          </div>

          {/* Savings Highlight */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Maximum savings at 2,500+ sq ft</span>
              <span className="font-semibold text-success">
                Save ${(BASE_PRICE - BASE_PRICE * 0.8).toFixed(2)}/sq ft
              </span>
            </div>
          </div>

          {/* Guarantee Note - matching PricingUpdateExplainer style */}
          <div className="flex items-start gap-3 bg-secondary/50 rounded-lg p-4 mt-6">
            <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">
              <span className="font-medium">Premium Wrap Guarantee:</span>{" "}
              <span className="text-muted-foreground">
                Print flaws reprinted at no cost.
              </span>
            </p>
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
