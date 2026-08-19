/**
 * Lightweight analytics dispatcher.
 * Sends the same event to GA4 (gtag) and Meta Pixel (custom events),
 * and no-ops safely when either tag is absent.
 */
import { trackPixel } from "@/lib/metaPixel";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const trackEvent = (
  event: string,
  params: Record<string, unknown> = {}
) => {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", event, params);
    trackPixel(event, params);
  } catch {
    /* analytics must never break the UI */
  }
};
