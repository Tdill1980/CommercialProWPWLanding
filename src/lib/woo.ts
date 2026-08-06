import { supabase } from "@/integrations/supabase/client";

/**
 * Thin client for the `woo-api` edge function — the single endpoint that
 * talks to the live WooCommerce store and the WP Rewards plugin.
 */

export type WooAction =
  | "ping"
  | "products"
  | "product"
  | "rewards_config"
  | "rewards_balance"
  | "raw"
  | "discover"
  | "diagnostics";

export async function callWoo<T = any>(
  action: WooAction,
  params: Record<string, unknown> = {},
): Promise<{ data: T | null; error: string | null }> {
  const { data, error } = await supabase.functions.invoke("woo-api", {
    body: { action, ...params },
  });

  if (error) {
    let details = error.message;
    try {
      const ctx = (error as any)?.context;
      if (ctx?.text) details = await ctx.text();
    } catch {
      /* ignore */
    }
    return { data: null, error: details };
  }

  return { data: data as T, error: null };
}

export const wooPing = () => callWoo("ping");
export type WooProductQuery = {
  search?: string;
  per_page?: number;
  page?: number;
  category?: string;
  featured?: boolean;
  orderby?: "date" | "price" | "title" | "popularity" | "rating";
  order?: "asc" | "desc";
};
export const wooProducts = (opts: WooProductQuery | string = {}, per_page = 10) => {
  const params: WooProductQuery =
    typeof opts === "string" ? { search: opts, per_page } : opts;
  return callWoo<{ products: WooProduct[] }>("products", params);
};
export const wooRewardsConfig = () => callWoo("rewards_config");
export const wooRewardsBalance = (email: string) =>
  callWoo("rewards_balance", { email });

export type WooProduct = {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  featured: boolean;
  images: Array<{ id: number; src: string; name: string; alt: string }>;
  average_rating?: string;
  short_description?: string;
  stock_status?: string;
};

export type WooDiagnosticStep = {
  id: string;
  label: string;
  status: "ok" | "fail" | "warn" | "skipped";
  http_status?: number;
  request?: string;
  detail?: string;
  response_snippet?: string;
  hint?: string;
};

export type WooDiagnostics = {
  overall: "ok" | "partial" | "blocked" | "error" | "not_configured";
  failed_step: string | null;
  failure_kind?:
    | "cloudflare_block"
    | "network_error"
    | "auth_rejected"
    | "woocommerce_error"
    | "missing_rewards_endpoints"
    | null;
  steps: WooDiagnosticStep[];
  checked_at: string;
};

export const wooDiagnostics = () => callWoo<WooDiagnostics>("diagnostics");
