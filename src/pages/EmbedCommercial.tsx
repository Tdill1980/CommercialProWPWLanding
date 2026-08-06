import { useEffect } from "react";
import {
  BulkPricingSection,
  PricingUpdateExplainer,
  ApproveProPlusSection,
  TestimonialSection,
  JacksonQuoteEmbed,
  ApproveProTeaser,
  StickyQuoteBar,
  TrustLogosStrip,
  CommercialInfoStrip,
  ProductSlider,
} from "@/components/commercial";

/**
 * Headless embed route for dropping CommercialPro into the existing
 * WePrintWraps WordPress/Elementor site via an <iframe>.
 *
 * - No site header, nav, footer, or CTA contact section (the WP host page
 *   already provides those).
 * - noindex,nofollow so the embed URL never competes with the canonical pages.
 */
const EmbedCommercial = () => {
  // Inject a robots noindex,nofollow meta tag for this route only.
  // Restores the previous value on unmount so the main site stays indexable.
  useEffect(() => {
    const existing = document.querySelector('meta[name="robots"]');
    const previousContent = existing?.getAttribute("content") ?? null;

    if (existing) {
      existing.setAttribute("content", "noindex,nofollow");
    } else {
      const meta = document.createElement("meta");
      meta.name = "robots";
      meta.content = "noindex,nofollow";
      document.head.appendChild(meta);
    }

    return () => {
      if (existing) {
        if (previousContent) {
          existing.setAttribute("content", previousContent);
        } else {
          existing.remove();
        }
      } else {
        document
          .querySelector('meta[name="robots"]')
          ?.remove();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero with quote tool */}
      <section className="relative min-h-[600px] lg:min-h-[660px] overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 lg:py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left side - Hero text */}
            <div className="pt-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.1] mb-4">
                Professional Wraps
                <br />
                <span className="text-primary">Built for Business</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6 max-w-xl">
                Built for wrap shops that don't own printers. Wholesale pricing,
                volume discounts, and 3D proofs that sell jobs.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-foreground">
                  <span className="text-sm">Premium Wrap Guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <span className="text-sm">1-2 Day Production</span>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <span className="text-sm">From $4.22/sq ft at 2,500+ sq ft</span>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <span className="text-sm">3M Premium Materials</span>
                </div>
              </div>
            </div>

            {/* Right side - Quote Tool Embed */}
            <div className="lg:pt-2">
              <JacksonQuoteEmbed className="shadow-2xl shadow-black/30" />
            </div>
          </div>

          {/* ApprovePro Teaser */}
          <div className="mt-8">
            <ApproveProTeaser />
          </div>
        </div>
      </section>

      {/* Trust Logos Strip */}
      <TrustLogosStrip />

      {/* Commercial Info Strip */}
      <CommercialInfoStrip />

      {/* Shop Our Products - WooCommerce slider */}
      <section className="border-y border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                Shop Our Products
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Featured wrap materials and supplies from our store
              </p>
            </div>
          </div>
          <ProductSlider sort="featured" count={12} />
        </div>
      </section>

      {/* Volume Pricing */}
      <section id="volume" className="scroll-mt-20">
        <BulkPricingSection />
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-20">
        <PricingUpdateExplainer />
      </section>

      {/* 3D Proofing */}
      <section id="proofing" className="scroll-mt-20">
        <ApproveProPlusSection />
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="scroll-mt-20">
        <TestimonialSection />
      </section>

      {/* Sticky Quote Bar */}
      <StickyQuoteBar />
    </div>
  );
};

export default EmbedCommercial;
