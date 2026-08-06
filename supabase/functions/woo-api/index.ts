import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

/**
 * woo-api
 *
 * Single secure endpoint that talks to the LIVE WooCommerce store
 * (weprintwraps.com) and to the WP Rewards plugin REST API.
 *
 * POST https://<project>.supabase.co/functions/v1/woo-api
 * Body: { action: string, ...params }
 *
 * Actions:
 *  - "ping"            -> verifies credentials against /wc/v3/system_status or /products
 *  - "products"        -> { search?, per_page?, page?, category? }
 *  - "product"         -> { id }
 *  - "rewards_config"  -> earn/redeem rules from the WP Rewards plugin
 *  - "rewards_balance" -> { email? | customer_id? } points balance for a shopper
 *  - "raw"             -> { namespace, path, method?, query?, body? } escape hatch
 *
 * Credentials (project secrets):
 *  WOO_STORE_URL         e.g. https://weprintwraps.com
 *  WOO_CONSUMER_KEY      ck_...
 *  WOO_CONSUMER_SECRET   cs_...
 *  WP_REWARDS_NAMESPACE  optional, e.g. "wlr/v2" (auto-detected when unset)
 */

const RAW_STORE_URL = (Deno.env.get('WOO_STORE_URL') ?? '').trim().replace(/\/+$/, '');
// Tolerate a store URL saved without a scheme (e.g. "example.com").
const STORE_URL = RAW_STORE_URL && !/^https?:\/\//i.test(RAW_STORE_URL)
  ? `https://${RAW_STORE_URL}`
  : RAW_STORE_URL;
const CK = Deno.env.get('WOO_CONSUMER_KEY') ?? '';
const CS = Deno.env.get('WOO_CONSUMER_SECRET') ?? '';
const REWARDS_NS_ENV = Deno.env.get('WP_REWARDS_NAMESPACE') ?? '';

// Namespaces we allow the proxy to reach. Keeps the escape hatch safe.
const ALLOWED_NAMESPACES = [
  'wc/v3',
  'wc/store/v1',
  'wc-analytics',
  'wlr/v2', // WPLoyalty
  'wlr/v1',
  'wp-rewards/v1', // WP Rewards
  'wprewards/v1',
  'points-rewards/v1',
  'sumo-reward-points/v1',
];

const REWARDS_CANDIDATES = REWARDS_NS_ENV
  ? [REWARDS_NS_ENV]
  : ['wlr/v2', 'wp-rewards/v1', 'wprewards/v1', 'points-rewards/v1', 'sumo-reward-points/v1'];

function authHeader() {
  return 'Basic ' + btoa(`${CK}:${CS}`);
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function wp(
  namespace: string,
  path: string,
  { method = 'GET', query, body }: { method?: string; query?: Record<string, string>; body?: unknown } = {},
) {
  const url = new URL(`${STORE_URL}/wp-json/${namespace}${path.startsWith('/') ? path : `/${path}`}`);
  if (query) for (const [k, v] of Object.entries(query)) if (v !== undefined && v !== '') url.searchParams.set(k, v);

  const res = await fetch(url.toString(), {
    method,
    headers: {
      Authorization: authHeader(),
      'Content-Type': 'application/json',
      Accept: 'application/json',
      // Cloudflare/WAF on many WP hosts blocks default server user agents.
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let parsed: unknown = text;
  try {
    parsed = JSON.parse(text);
  } catch {
    // keep raw text (WP sometimes returns HTML on permalink/plugin issues)
  }
  return { ok: res.ok, status: res.status, data: parsed, url: url.toString() };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  if (!STORE_URL || !CK || !CS) {
    return json(
      {
        error: 'store_not_configured',
        message:
          'WOO_STORE_URL, WOO_CONSUMER_KEY and WOO_CONSUMER_SECRET must be set before this endpoint can reach the live store.',
      },
      503,
    );
  }

  let payload: Record<string, any> = {};
  try {
    payload = req.method === 'POST' ? await req.json() : Object.fromEntries(new URL(req.url).searchParams);
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }

  const action = String(payload.action ?? 'ping');

  try {
    switch (action) {
      case 'ping': {
        const r = await wp('wc/v3', '/products', { query: { per_page: '1' } });
        return json(
          {
            connected: r.ok,
            status: r.status,
            store: STORE_URL,
            details: r.ok ? undefined : r.data,
          },
          r.ok ? 200 : r.status,
        );
      }

      case 'products': {
        const r = await wp('wc/v3', '/products', {
          query: {
            search: payload.search ? String(payload.search) : '',
            per_page: String(Math.min(Number(payload.per_page) || 10, 50)),
            page: String(Math.max(Number(payload.page) || 1, 1)),
            category: payload.category ? String(payload.category) : '',
            status: 'publish',
          },
        });
        if (!r.ok) return json({ error: 'woocommerce_error', status: r.status, details: r.data }, r.status);
        return json({ products: r.data });
      }

      case 'product': {
        const id = Number(payload.id);
        if (!Number.isFinite(id) || id <= 0) return json({ error: 'invalid_id' }, 400);
        const r = await wp('wc/v3', `/products/${id}`);
        if (!r.ok) return json({ error: 'woocommerce_error', status: r.status, details: r.data }, r.status);
        return json({ product: r.data });
      }

      case 'rewards_config': {
        // Probe each known rewards namespace until one answers.
        const attempts: Array<{ namespace: string; status: number }> = [];
        for (const ns of REWARDS_CANDIDATES) {
          for (const path of ['/settings', '/config', '/rules', '/points']) {
            const r = await wp(ns, path);
            attempts.push({ namespace: `${ns}${path}`, status: r.status });
            if (r.ok) return json({ namespace: ns, path, config: r.data });
          }
        }
        return json(
          {
            error: 'rewards_namespace_not_found',
            message:
              'No WP Rewards REST namespace responded. Set WP_REWARDS_NAMESPACE to the plugin namespace shown at /wp-json.',
            attempts,
          },
          404,
        );
      }

      case 'rewards_balance': {
        const email = payload.email ? String(payload.email).trim().toLowerCase() : '';
        const customerId = payload.customer_id ? String(payload.customer_id) : '';
        if (!email && !customerId) return json({ error: 'email_or_customer_id_required' }, 400);
        if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: 'invalid_email' }, 400);

        const attempts: Array<{ endpoint: string; status: number }> = [];
        for (const ns of REWARDS_CANDIDATES) {
          for (const path of ['/customer', '/points', '/user-points', '/balance']) {
            const r = await wp(ns, path, {
              query: { email, customer_id: customerId, user_id: customerId },
            });
            attempts.push({ endpoint: `${ns}${path}`, status: r.status });
            if (r.ok) return json({ namespace: ns, path, rewards: r.data });
          }
        }
        return json(
          {
            error: 'rewards_lookup_failed',
            message:
              'Could not read a points balance. Confirm the WP Rewards plugin exposes REST routes and set WP_REWARDS_NAMESPACE.',
            attempts,
          },
          404,
        );
      }

      case 'raw': {
        const namespace = String(payload.namespace ?? '');
        const path = String(payload.path ?? '');
        const method = String(payload.method ?? 'GET').toUpperCase();
        if (!ALLOWED_NAMESPACES.includes(namespace)) {
          return json({ error: 'namespace_not_allowed', allowed: ALLOWED_NAMESPACES }, 400);
        }
        if (!path.startsWith('/') || path.includes('..')) return json({ error: 'invalid_path' }, 400);
        if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) return json({ error: 'invalid_method' }, 400);

        const r = await wp(namespace, path, {
          method,
          query: payload.query ?? undefined,
          body: payload.body ?? undefined,
        });
        return json({ status: r.status, data: r.data }, r.ok ? 200 : r.status);
      }

      case 'discover': {
        // Lists every REST namespace the store exposes — use this to find the rewards plugin.
        const res = await fetch(`${STORE_URL}/wp-json`, {
          headers: {
            Accept: 'application/json',
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          },
        });
        const data = await res.json().catch(() => null);
        return json({ namespaces: (data as any)?.namespaces ?? null, status: res.status });
      }

      default:
        return json({ error: 'unknown_action', action }, 400);
    }
  } catch (e) {
    console.error('woo-api failure', e);
    return json({ error: 'request_failed', message: String((e as Error)?.message ?? e) }, 500);
  }
});
