import { useEffect } from "react";
import {
  BulkPricingSection,
  PricingUpdateExplainer,
  
  TestimonialSection,
  JacksonQuoteEmbed,
  StickyQuoteBar,
  TrustLogosStrip,
  CommercialInfoStrip,
  WallWrapProduct,
  PromoCodesSection,
  PromoCodesStrip,
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

  // Broadcast the document height to the parent window so the host page
  // (weprintwraps.com/commercialpro/) can size this iframe without scrollbars.
  // Only fires when actually embedded (window.parent !== window).
  useEffect(() => {
    if (window.parent === window) return; // not in an iframe

    const send = () => {
      const height = Math.ceil(
        document.documentElement.scrollHeight || document.body.scrollHeight
      );
      if (height > 0) {
        window.parent.postMessage(
          { type: "WPW_COMMERCIAL_HEIGHT", height },
          "*" // host page listener verifies our origin
        );
      }
    };

    // Initial + interval-based fallback (covers late iframe image loads).
    send();
    const interval = window.setInterval(send, 800);

    // ResizeObserver for smooth, accurate updates.
    const ro = new ResizeObserver(() => send());
    ro.observe(document.body);

    return () => {
      window.clearInterval(interval);
      ro.disconnect();
    };
  }, []);

  const sectionLinks = [
    { href: "#shop", label: "Shop" },
    { href: "#volume", label: "Volume Pricing" },
    { href: "#pricing", label: "Pricing" },
    { href: "#proofing", label: "3D Proofing" },
    { href: "#testimonials", label: "Reviews" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Slim nav strip — the host page is a full-bleed canvas with no theme
          header, so this guarantees the embed always has navigation. */}
      <header className="sticky top-0 z-40 bg-background border-b border-border shadow-sm">
        <nav
          aria-label="CommercialPro"
          className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center gap-4"
        >
          <a
            href="https://weprintwraps.com/"
            target="_top"
            className="shrink-0 font-black tracking-tight text-foreground text-sm sm:text-base"
          >
            WePrintWraps <span className="text-primary">CommercialPro</span>
          </a>

          <div className="flex-1 min-w-0 overflow-x-auto">
            <ul className="flex items-center gap-4 sm:gap-5 whitespace-nowrap">
              {sectionLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <a
            href="https://weprintwraps.com/contact/"
            target="_top"
            className="shrink-0 inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
          >
            Contact
          </a>
        </nav>
      </header>

      {/* Fleet promo codes — always above the fold */}
      <PromoCodesStrip />


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

        </div>
      </section>

      {/* Fleet Promo Codes — above the fold priority */}
      <section id="promo-codes" className="scroll-mt-20">
        <PromoCodesSection />
      </section>


      {/* Trust Logos Strip */}
      <TrustLogosStrip />

      {/* Commercial Info Strip */}
      <CommercialInfoStrip />

      {/* Shop Our Products - WooCommerce slider */}
      <section id="shop" className="scroll-mt-20 border-y border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-2">
                From Our Store
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                Shop Our Products
              </h2>
              <p className="text-muted-foreground text-sm mt-1 max-w-xl">
                Featured wrap materials and supplies — same wholesale pricing, shipped fast.
              </p>
            </div>
          </div>
          <WallWrapProduct />
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
