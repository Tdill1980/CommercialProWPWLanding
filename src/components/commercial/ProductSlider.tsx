import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Loader2, Package, Star } from "lucide-react";
import { wooProducts, type WooProduct } from "@/lib/woo";

/**
 * WooCommerce product slider — purpose-built for embedding into the
 * WePrintWraps Elementor homepage via the /embed/commercial iframe.
 *
 * Fetches published products from the live store through the secure
 * woo-api edge function and renders a responsive, swipeable carousel.
 * Gracefully degrades to a message when the store API is unreachable
 * (e.g. Cloudflare WAF) so the embed never looks broken.
 */
interface ProductSliderProps {
  /** Number of products to fetch */
  count?: number;
  /** "featured" shows the store's featured flag, "recent" shows newest, "popular" by sales */
  sort?: "featured" | "recent" | "popular";
  /** Category slug filter */
  category?: string;
  className?: string;
}

export const ProductSlider = ({
  count = 12,
  sort = "featured",
  category,
  className = "",
}: ProductSliderProps) => {
  const [products, setProducts] = useState<WooProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    dragFree: false,
    slidesToScroll: 1,
  });

  const [prevEnabled, setPrevEnabled] = useState(false);
  const [nextEnabled, setNextEnabled] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevEnabled(emblaApi.canScrollPrev());
    setNextEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      const params =
        sort === "featured"
          ? { featured: true, per_page: count, orderby: "date" as const, order: "desc" as const }
          : sort === "recent"
            ? { per_page: count, orderby: "date" as const, order: "desc" as const }
            : { per_page: count, orderby: "popularity" as const, order: "desc" as const };
      const { data, error: err } = await wooProducts(
        category ? { ...params, category } : params,
      );
      if (cancelled) return;
      if (err) {
        setError(err);
      } else {
        setProducts(data?.products ?? []);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [count, sort, category]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading products…</span>
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-6">
        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Package className="h-7 w-7 text-primary" />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">
          Products unavailable
        </p>
        <p className="text-xs text-muted-foreground max-w-sm">
          {error
            ? "The store connection is temporarily unavailable. If this persists, check the WooCommerce connection in the admin diagnostics panel."
            : "No products found for this selection."}
        </p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Carousel viewport */}
      <div className="overflow-hidden px-1" ref={emblaRef}>
        <div className="flex gap-4">
          {products.map((p) => {
            const img = p.images?.[0]?.src;
            const rating = parseFloat(p.average_rating || "0");
            return (
              <a
                key={p.id}
                href={p.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex-[0_0_auto] w-[260px] sm:w-[280px] md:w-[300px] snap-start"
              >
                <div className="bg-card border border-border rounded-xl overflow-hidden transition-shadow hover:shadow-lg hover:border-primary/40">
                  {/* Image */}
                  <div className="relative aspect-square bg-muted overflow-hidden">
                    {img ? (
                      <img
                        src={img}
                        alt={p.images?.[0]?.alt || p.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <Package className="h-10 w-10 text-muted-foreground/40" />
                      </div>
                    )}
                    {p.on_sale && (
                      <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                        SALE
                      </span>
                    )}
                  </div>
                  {/* Body */}
                  <div className="p-3">
                    <p className="font-semibold text-sm text-foreground leading-snug line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                      {p.name}
                    </p>
                    {rating > 0 && (
                      <div className="flex items-center gap-1 mb-1.5">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs text-muted-foreground">
                          {rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-foreground">
                        {p.price ? `$${p.price}` : "—"}
                      </span>
                      {p.regular_price && p.sale_price && p.on_sale && (
                        <span className="text-xs text-muted-foreground line-through">
                          ${p.regular_price}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Arrows */}
      {prevEnabled && (
        <button
          onClick={scrollPrev}
          aria-label="Previous products"
          className="hidden md:flex absolute left-[-12px] top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-card border border-border shadow-md hover:bg-muted transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      {nextEnabled && (
        <button
          onClick={scrollNext}
          aria-label="Next products"
          className="hidden md:flex absolute right-[-12px] top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-card border border-border shadow-md hover:bg-muted transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      {/* Mobile swipe hint */}
      <div className="flex md:hidden justify-center gap-1.5 mt-3">
        {Array.from({ length: Math.min(products.length, 6) }).map((_, i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-border"
          />
        ))}
      </div>
    </div>
  );
};
