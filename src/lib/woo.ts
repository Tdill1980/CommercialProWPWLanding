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
  | "discover";

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
export const wooProducts = (search?: string, per_page = 10) =>
  callWoo("products", { search, per_page });
export const wooRewardsConfig = () => callWoo("rewards_config");
export const wooRewardsBalance = (email: string) =>
  callWoo("rewards_balance", { email });
