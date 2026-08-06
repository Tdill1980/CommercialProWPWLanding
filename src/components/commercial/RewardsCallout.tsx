import { useEffect, useState } from "react";
import { Gift, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { wooRewardsBalance, wooRewardsConfig } from "@/lib/woo";

/**
 * RewardsCallout
 *
 * Reads the WP Rewards plugin through the `woo-api` edge function.
 * - Shows the earn rate (points per $1) and estimated points on the current order.
 * - Lets a customer look up their live points balance by email.
 */

interface RewardsCalloutProps {
  /** Current estimated order total, used to project points earned */
  orderTotal?: number;
}

const DEFAULT_POINTS_PER_DOLLAR = 1;

function extractPoints(payload: any): number | null {
  if (payload == null) return null;
  if (typeof payload === "number") return payload;
  const candidates = [
    payload.points,
    payload.balance,
    payload.total_points,
    payload.available_points,
    payload?.data?.points,
    payload?.data?.balance,
    Array.isArray(payload) ? payload[0]?.points : undefined,
  ];
  const found = candidates.find((v) => typeof v === "number" || (typeof v === "string" && v !== ""));
  return found === undefined ? null : Number(found);
}

export const RewardsCallout = ({ orderTotal = 0 }: RewardsCalloutProps) => {
  const [pointsPerDollar, setPointsPerDollar] = useState<number>(DEFAULT_POINTS_PER_DOLLAR);
  const [email, setEmail] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [redeemValue, setRedeemValue] = useState<number>(0.01);
  const [estimated, setEstimated] = useState(false);
  const [detail, setDetail] = useState<{
    totalSpent?: number;
    ordersCount?: number;
    eligible?: boolean;
    redeemableValue?: number;
  } | null>(null);

  useEffect(() => {
    let active = true;
    wooRewardsConfig().then(({ data }) => {
      if (!active || !data) return;
      const rate =
        data?.config?.points_per_currency ??
        data?.config?.earn_point ??
        data?.config?.points_per_dollar;
      if (typeof rate === "number" && rate > 0) setPointsPerDollar(rate);
      const redeem = data?.config?.redeem_value_per_point;
      if (typeof redeem === "number" && redeem > 0) setRedeemValue(redeem);
    });
    return () => {
      active = false;
    };
  }, []);

  const projectedPoints = Math.floor(orderTotal * pointsPerDollar);

  const lookup = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setMessage(null);
    setBalance(null);
    setDetail(null);
    setEstimated(false);
    const { data, error } = await wooRewardsBalance(email.trim());
    setLoading(false);

    if (error) {
      setMessage("Rewards lookup unavailable right now.");
      return;
    }
    const rewards = data?.rewards;
    const pts = extractPoints(rewards);
    if (pts === null) {
      setMessage("No rewards account found for that email.");
      return;
    }
    setBalance(pts);
    setEstimated(Boolean(rewards?.estimated));
    if (data?.source === "woocommerce_fallback") {
      setDetail({
        totalSpent: Number(rewards?.total_spent) || 0,
        ordersCount: Number(rewards?.orders_count) || 0,
        eligible: rewards?.eligible !== false,
        redeemableValue:
          typeof rewards?.redeemable_value === "number"
            ? rewards.redeemable_value
            : pts * redeemValue,
      });
    }
  };

  return (
    <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Gift className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">Rewards on every order</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Earn {pointsPerDollar} point{pointsPerDollar === 1 ? "" : "s"} per $1 spent, redeemable
            as store credit at checkout.
          </p>

          {projectedPoints > 0 && (
            <p className="mt-3 text-sm text-foreground">
              This order earns approximately{" "}
              <span className="font-bold text-primary">
                {projectedPoints.toLocaleString()} points
              </span>
              .
            </p>
          )}

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && lookup()}
              placeholder="your@company.com"
              className="h-10 sm:max-w-xs"
              aria-label="Email for rewards balance lookup"
            />
            <Button onClick={lookup} disabled={loading} className="h-10">
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Check balance
            </Button>
          </div>

          {balance !== null && (
            <div className="mt-3 space-y-1 text-sm text-foreground">
              <p>
                {estimated ? "Estimated balance" : "Current balance"}:{" "}
                <span className="font-bold text-success">{balance.toLocaleString()} points</span>
                {detail?.redeemableValue !== undefined && detail.redeemableValue > 0 && (
                  <span className="text-muted-foreground">
                    {" "}
                    (~${detail.redeemableValue.toFixed(2)} store credit)
                  </span>
                )}
              </p>
              {detail && (
                <p className="text-xs text-muted-foreground">
                  Based on {detail.ordersCount?.toLocaleString()} order
                  {detail.ordersCount === 1 ? "" : "s"} and $
                  {(detail.totalSpent ?? 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  lifetime spend
                  {detail.eligible === false ? " — not yet eligible to redeem." : "."}
                  {estimated && " Estimated from account history while the rewards plugin API is unavailable."}
                </p>
              )}
            </div>
          )}
          {message && <p className="mt-3 text-sm text-muted-foreground">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default RewardsCallout;
