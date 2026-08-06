import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { wooDiagnostics, type WooDiagnostics as Diag, type WooDiagnosticStep } from "@/lib/woo";
import { AlertTriangle, CheckCircle2, Loader2, RefreshCw, ShieldAlert, XCircle } from "lucide-react";

const OVERALL_COPY: Record<Diag["overall"], { label: string; tone: string }> = {
  ok: { label: "All systems connected", tone: "bg-primary text-primary-foreground" },
  partial: { label: "Store connected — rewards incomplete", tone: "bg-secondary text-secondary-foreground" },
  blocked: { label: "Blocked before reaching WordPress", tone: "bg-destructive text-destructive-foreground" },
  error: { label: "Store request failed", tone: "bg-destructive text-destructive-foreground" },
  not_configured: { label: "Credentials missing", tone: "bg-muted text-muted-foreground" },
};

const FAILURE_COPY: Record<string, string> = {
  cloudflare_block:
    "Cloudflare / WAF is blocking the backend's data-center IPs. Add a WAF Skip rule for paths containing /wp-json/ (managed rules, rate limiting and Super Bot Fight Mode).",
  network_error: "The store URL did not resolve. Verify WOO_STORE_URL includes https:// and the correct domain.",
  auth_rejected:
    "WooCommerce rejected the consumer key/secret. Regenerate a Read/Write REST key and update the stored secrets.",
  woocommerce_error: "WooCommerce responded with an error — see the response body below.",
  missing_rewards_endpoints:
    "The store is reachable and authenticated, but no WP Rewards REST namespace answers. Confirm the plugin is active and exposes REST routes, then set WP_REWARDS_NAMESPACE.",
};

function StepIcon({ status }: { status: WooDiagnosticStep["status"] }) {
  if (status === "ok") return <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden />;
  if (status === "warn") return <AlertTriangle className="h-5 w-5 text-secondary-foreground" aria-hidden />;
  if (status === "skipped") return <ShieldAlert className="h-5 w-5 text-muted-foreground" aria-hidden />;
  return <XCircle className="h-5 w-5 text-destructive" aria-hidden />;
}

export default function WooDiagnosticsPage() {
  const [data, setData] = useState<Diag | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    setError(null);
    const res = await wooDiagnostics();
    if (res.error) setError(res.error);
    else setData(res.data);
    setLoading(false);
  };

  useEffect(() => {
    document.title = "Woo API Diagnostics | CommercialPro Admin";
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex,nofollow";
    document.head.appendChild(robots);
    run();
    return () => {
      robots.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const overall = data ? OVERALL_COPY[data.overall] : null;

  return (
    <>
      <main className="mx-auto max-w-4xl px-4 py-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Woo API Diagnostics</h1>
            <p className="text-sm text-muted-foreground">
              Live connectivity check for the WooCommerce store and the WP Rewards plugin.
            </p>
          </div>
          <Button onClick={run} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Re-run check
          </Button>
        </header>

        {error && (
          <Card className="mb-6 border-destructive">
            <CardHeader>
              <CardTitle className="text-base">Diagnostics request failed</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap break-words rounded bg-muted p-3 text-xs">{error}</pre>
            </CardContent>
          </Card>
        )}

        {data && (
          <>
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                <CardTitle className="text-base">Overall status</CardTitle>
                <Badge className={overall?.tone}>{overall?.label}</Badge>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  Last checked {new Date(data.checked_at).toLocaleString()}
                </p>
                {data.failed_step && (
                  <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4">
                    <p className="font-medium">
                      First failing step: <code>{data.failed_step}</code>
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      {FAILURE_COPY[data.failure_kind ?? ""] ?? "See the step details below."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-4">
              {data.steps.map((step, i) => (
                <Card key={step.id}>
                  <CardHeader className="flex flex-row items-start gap-3 space-y-0">
                    <StepIcon status={step.status} />
                    <div className="flex-1">
                      <CardTitle className="text-base">
                        {i + 1}. {step.label}
                      </CardTitle>
                      {step.detail && (
                        <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{step.detail}</p>
                      )}
                    </div>
                    {step.http_status !== undefined && (
                      <Badge variant={step.status === "ok" ? "secondary" : "destructive"}>HTTP {step.http_status}</Badge>
                    )}
                  </CardHeader>
                  {(step.request || step.response_snippet || step.hint) && (
                    <CardContent className="space-y-3 text-xs">
                      <Separator />
                      {step.request && (
                        <div>
                          <p className="mb-1 font-medium uppercase tracking-wide text-muted-foreground">Request</p>
                          <pre className="overflow-x-auto rounded bg-muted p-3">{step.request}</pre>
                        </div>
                      )}
                      {step.response_snippet && (
                        <div>
                          <p className="mb-1 font-medium uppercase tracking-wide text-muted-foreground">Response</p>
                          <pre className="max-h-56 overflow-auto whitespace-pre-wrap break-words rounded bg-muted p-3">
                            {step.response_snippet}
                          </pre>
                        </div>
                      )}
                      {step.hint && (
                        <p className="rounded border border-border bg-accent/30 p-3 text-sm">{step.hint}</p>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </>
        )}

        {!data && !error && loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Running connectivity checks…
          </div>
        )}
      </main>
    </>
  );
}
