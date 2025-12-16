import {
  CommercialInfoStrip,
  BulkPricingSection,
  PricingUpdateExplainer,
  ApproveProPlusSection,
  BulkOrderIndicator,
  CommercialFooter,
} from "@/components/commercial";

/**
 * CommercialPro Demo Page
 * 
 * Showcases all modular CommercialPro sections.
 * These components can be embedded individually into the existing WPW site.
 */

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                CommercialPro
              </h1>
              <p className="text-sm text-muted-foreground">
                Modular sections for WePrintWraps.com
              </p>
            </div>
            <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
              Preview Mode
            </span>
          </div>
        </div>
      </header>

      <main>
        {/* Section 1: Commercial Info Strip */}
        <div className="border-b border-border">
          <div className="max-w-5xl mx-auto px-6 py-8">
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Component 1
            </span>
            <h2 className="text-lg font-semibold text-foreground mt-1 mb-4">
              Commercial Info Strip
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Place below value props (Wholesale Pricing • Fast Turnaround • Professional Grade • No Minimums)
            </p>
          </div>
          <CommercialInfoStrip />
        </div>

        {/* Section 2: Pricing Update Explainer */}
        <div className="border-b border-border">
          <div className="max-w-5xl mx-auto px-6 py-8">
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Component 2
            </span>
            <h2 className="text-lg font-semibold text-foreground mt-1 mb-4">
              Pricing Update Explainer
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Explains $5.90 → $5.27 price reduction. Can be section or inline link trigger.
            </p>
          </div>
          <PricingUpdateExplainer />
        </div>

        {/* Section 2b: Inline variant demo */}
        <div className="border-b border-border bg-muted/30">
          <div className="max-w-5xl mx-auto px-6 py-8">
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Component 2b
            </span>
            <h2 className="text-lg font-semibold text-foreground mt-1 mb-4">
              Inline Pricing Link
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              For use next to "$5.27 per sq ft" references:
            </p>
            <div className="bg-background p-6 rounded-lg border border-border">
              <p className="text-foreground">
                Premium 3M IJ180 Wrap Film — <span className="font-semibold">$5.27 per sq ft</span>{" "}
                <PricingUpdateExplainer variant="inline" />
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Bulk Pricing */}
        <div className="border-b border-border">
          <div className="max-w-5xl mx-auto px-6 py-8">
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Component 3
            </span>
            <h2 className="text-lg font-semibold text-foreground mt-1 mb-4">
              Bulk Pricing Selector
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Interactive volume tier selector. Front-end only — does not affect checkout.
            </p>
          </div>
          <BulkPricingSection />
        </div>

        {/* Section 4: ApprovePro Plus */}
        <div className="border-b border-border">
          <div className="max-w-5xl mx-auto px-6 py-8">
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Component 4
            </span>
            <h2 className="text-lg font-semibold text-foreground mt-1 mb-4">
              ApprovePro Plus Explainer
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              2D → 3D proof system overview. Placeholder image included — swap for commercial van mockup.
            </p>
          </div>
          <ApproveProPlusSection />
        </div>

        {/* Section 5: Bulk Order Indicator */}
        <div className="border-b border-border">
          <div className="max-w-5xl mx-auto px-6 py-12">
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Component 5
            </span>
            <h2 className="text-lg font-semibold text-foreground mt-1 mb-4">
              Bulk Order Indicator
            </h2>
            <p className="text-sm text-muted-foreground mb-8">
              Add to upload/quote forms. Tags orders as "Commercial / Bulk" without blocking checkout.
            </p>
            <BulkOrderIndicator 
              onChange={(isBulk) => console.log("Bulk order:", isBulk)} 
            />
          </div>
        </div>

        {/* Section 6: Commercial Footer */}
        <div>
          <div className="max-w-5xl mx-auto px-6 py-8">
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Component 6
            </span>
            <h2 className="text-lg font-semibold text-foreground mt-1 mb-4">
              Commercial Footer Section
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Minimal footer block for wholesale/commercial contact info.
            </p>
          </div>
          <div className="bg-muted/30">
            <CommercialFooter />
          </div>
        </div>
      </main>

      {/* Integration Notes */}
      <footer className="bg-navy text-navy-foreground py-12 mt-16">
        <div className="max-w-5xl mx-auto px-6">
          <h3 className="text-lg font-semibold mb-4">Integration Notes</h3>
          <ul className="text-sm opacity-80 space-y-2">
            <li>• All components are standalone — import individually as needed</li>
            <li>• Components use semantic design tokens from index.css</li>
            <li>• No checkout or pricing logic is modified</li>
            <li>• Image placeholders marked with [Image swap: ...] notes</li>
            <li>• Export from: <code className="bg-white/10 px-2 py-0.5 rounded">@/components/commercial</code></li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default Index;