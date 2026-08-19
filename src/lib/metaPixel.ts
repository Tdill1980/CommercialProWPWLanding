/**
 * Meta (Facebook) Pixel loader.
 *
 * The id is NOT hard-coded — it comes from VITE_FACEBOOK_PIXEL_ID so the same
 * bundle can ship without a pixel. If the var is unset the loader is a no-op
 * (better an obvious gap than a placeholder id that silently reports nothing).
 */
const PIXEL_ID = import.meta.env.VITE_FACEBOOK_PIXEL_ID as string | undefined;

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[] };
    _fbq?: unknown;
  }
}

export const initMetaPixel = () => {
  if (!PIXEL_ID || window.fbq) return;

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const n: any = function (...args: unknown[]) {
    n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
  };
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
  window.fbq = n;
  window._fbq = n;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  window.fbq("init", PIXEL_ID);
  window.fbq("track", "PageView");
};

/** Fire a standard or custom Meta event; no-ops when the pixel is not configured. */
export const trackPixel = (event: string, params?: Record<string, unknown>) => {
  if (!PIXEL_ID || !window.fbq) return;
  const standard = new Set([
    "PageView",
    "Lead",
    "CompleteRegistration",
    "InitiateCheckout",
    "Contact",
    "ViewContent",
  ]);
  window.fbq(standard.has(event) ? "track" : "trackCustom", event, params);
};

export const isMetaPixelConfigured = Boolean(PIXEL_ID);
