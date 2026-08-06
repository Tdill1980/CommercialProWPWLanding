import { useSyncExternalStore } from "react";

/**
 * Shared prefill state handed off from the bulk pricing estimator
 * to the embedded Jackson Quote Builder.
 *
 * Category values match the Quote Builder's `wrapCategory` enum:
 * car-truck | trailer | boat | signs | walls | windows | fleet | other
 */
export interface QuotePrefill {
  /** Quote Builder wrapCategory value */
  category: string;
  /** Optional vehicle make (free text) */
  make: string;
  /** Optional vehicle model (free text) */
  model: string;
  /** Total project square footage from the estimator */
  sqft: number;
  /** Volume tier label, e.g. "500–999 sq ft" */
  tierLabel: string;
  /** Volume tier discount percentage, e.g. 10 */
  tierDiscount: number;
  /** Discounted price per sq ft for the tier */
  pricePerSqFt: number;
}

// Defaults mirror the estimator's initial state so the very first
// embed URL already carries a sensible prefill.
const INITIAL: QuotePrefill = {
  category: "fleet",
  make: "",
  model: "",
  sqft: 500,
  tierLabel: "500–999 sq ft",
  tierDiscount: 10,
  pricePerSqFt: 4.74,
};

let state: QuotePrefill = INITIAL;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

export const setQuotePrefill = (patch: Partial<QuotePrefill>) => {
  const next = { ...state, ...patch };
  const changed = (Object.keys(next) as (keyof QuotePrefill)[]).some(
    (k) => next[k] !== state[k]
  );
  if (!changed) return;
  state = next;
  emit();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => state;

export const useQuotePrefill = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

/** Query params appended to the embed URL on first load. */
export const prefillToParams = (p: QuotePrefill): Record<string, string> => {
  const params: Record<string, string> = {};
  if (p.category) params.category = p.category;
  if (p.make) params.make = p.make;
  if (p.model) params.model = p.model;
  if (p.sqft > 0) params.sqft = String(Math.round(p.sqft));
  if (p.tierDiscount > 0) {
    params.tier = p.tierLabel;
    params.tier_discount = String(p.tierDiscount);
    params.price_per_sqft = p.pricePerSqFt.toFixed(2);
  }
  return params;
};

/** postMessage payload sent to the iframe when the estimator changes. */
export const PREFILL_MESSAGE_TYPE = "WPW_QUOTE_PREFILL";

export const prefillToMessage = (p: QuotePrefill) => ({
  type: PREFILL_MESSAGE_TYPE,
  source: "commercialpro",
  category: p.category || undefined,
  make: p.make || undefined,
  model: p.model || undefined,
  sqft: p.sqft > 0 ? Math.round(p.sqft) : undefined,
  tier: p.tierLabel || undefined,
  tier_discount: p.tierDiscount || undefined,
  price_per_sqft: p.pricePerSqFt || undefined,
});
