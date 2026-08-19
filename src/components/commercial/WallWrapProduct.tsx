import { ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

/**
 * Featured product card for Wall Wrap Printing (Avery HP MPI 2610).
 * Links straight to the live WooCommerce product page.
 */

const PRODUCT_URL =
  "https://weprintwraps.com/our-products/wall-wrap-printed-vinyl/";

const IMAGES = [
  {
    src: "https://weprintwraps.com/wp-content/uploads/2026/01/shutterstock_2574021759-scaled.jpg",
    alt: "Large-format printed wall wrap installed in a modern commercial interior hallway",
  },
  {
    src: "https://weprintwraps.com/wp-content/uploads/2026/01/shutterstock_1165056616-1-scaled.jpg",
    alt: "Residential living room interior featuring a floral wall wrap installed behind a sofa",
  },
];

const SPECS = [
  "Avery HP MPI 2610 wall vinyl",
  "Matte / luster finish",
  "All panels billed at 54\" width",
  "Shipped ready for professional installation",
  "Earn 1 point per $1 spent",
];

export const WallWrapProduct = ({ className = "" }: { className?: string }) => {
  const go = () => trackEvent("product_click", { product: "wall_wrap_2610" });

  return (
    <div
      className={`grid lg:grid-cols-2 gap-6 lg:gap-10 items-center rounded-2xl border-2 border-border bg-card p-4 sm:p-6 lg:p-8 shadow-2xl shadow-black/20 ${className}`}
    >
      {/* Imagery */}
      <div className="grid grid-cols-3 gap-3">
        <img
          src={IMAGES[0].src}
          alt={IMAGES[0].alt}
          loading="lazy"
          className="col-span-3 w-full h-56 sm:h-72 object-cover rounded-xl border border-border"
        />
        <img
          src={IMAGES[1].src}
          alt={IMAGES[1].alt}
          loading="lazy"
          className="col-span-1 w-full h-20 sm:h-24 object-cover rounded-lg border border-border"
        />
        <div className="col-span-2 flex items-center rounded-lg border border-primary/30 bg-primary/5 px-3 py-2">
          <p className="text-xs sm:text-sm text-muted-foreground leading-snug">
            Offices, retail, gyms and commercial interiors — printed to your artwork.
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="min-w-0">
        <div className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
          Featured Product
        </div>
        <h3 className="text-2xl md:text-3xl font-black text-foreground tracking-tight mb-3 text-balance">
          Wall Wrap Printing | Avery HP MPI 2610
        </h3>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl font-black text-primary">$3.25</span>
          <span className="text-sm text-muted-foreground">per linear foot</span>
        </div>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-5">
          Custom printed wall wraps for offices, retail spaces, gyms, and commercial
          interiors. Billed per linear foot at 54&quot; panel width.
        </p>

        <ul className="space-y-2 mb-6">
          {SPECS.map((s) => (
            <li key={s} className="flex items-start gap-2 text-sm text-foreground">
              <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span className="min-w-0">{s}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg" className="font-semibold" onClick={go}>
            <a href={PRODUCT_URL} target="_top" rel="noopener">
              Order Wall Wrap
              <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="font-semibold">
            <a href="/wall-wraps" target="_top">
              Preview designs
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WallWrapProduct;
