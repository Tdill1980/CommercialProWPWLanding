import { useState } from "react";
import { z } from "zod";
import { Upload, CheckCircle2, Loader2, FileImage, X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";

const PRODUCT_URL =
  "https://weprintwraps.com/our-products/wall-wrap-printed-vinyl/";

const MAX_FILE_BYTES = 100 * 1024 * 1024; // 100MB
const ACCEPTED = [
  "image/jpeg",
  "image/png",
  "image/tiff",
  "application/pdf",
  "application/postscript",
  "application/illustrator",
  "application/zip",
];

const schema = z.object({
  name: z.string().trim().nonempty({ message: "Name is required" }).max(100),
  email: z.string().trim().email({ message: "Enter a valid email" }).max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  widthFt: z.string().trim().max(10).optional().or(z.literal("")),
  heightFt: z.string().trim().max(10).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const WallWrapQuoteForm = ({ className = "" }: { className?: string }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    widthFt: "",
    heightFt: "",
    notes: "",
  });
  const [bulk, setBulk] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [refId, setRefId] = useState<string | null>(null);

  const set = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const pickFile = (f: File | null) => {
    setError(null);
    if (!f) return setFile(null);
    if (f.size > MAX_FILE_BYTES) {
      setError("File must be under 100MB. Send a link in the notes instead.");
      return;
    }
    if (ACCEPTED.length && f.type && !ACCEPTED.includes(f.type)) {
      setError("Accepted files: JPG, PNG, TIFF, PDF, AI/EPS, or ZIP.");
      return;
    }
    setFile(f);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setSubmitting(true);
    try {
      let artworkPath: string | null = null;

      if (file) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80);
        const path = `${crypto.randomUUID()}/${safeName}`;
        const { error: upErr } = await supabase.storage
          .from("wall-wrap-artwork")
          .upload(path, file, { upsert: false, contentType: file.type || undefined });
        if (upErr) throw new Error(`Artwork upload failed: ${upErr.message}`);
        artworkPath = path;
      }

      const dims =
        form.widthFt && form.heightFt
          ? `${form.widthFt}ft × ${form.heightFt}ft`
          : "size TBD";

      const { data, error: insErr } = await supabase
        .from("leads_inbox")
        .insert({
          source: "web",
          intent: "quote_request",
          confidence: 1,
          caller_name: parsed.data.name,
          caller_email: parsed.data.email,
          caller_phone: parsed.data.phone || null,
          caller_company: parsed.data.company || null,
          summary: `Wall Wrap quote • ${dims}${bulk ? " • BULK/COMMERCIAL" : ""}${
            artworkPath ? " • artwork attached" : " • no artwork yet"
          }`,
          next_action: "follow_up",
          raw: {
            product: "wall_wrap_2610",
            bulk_commercial: bulk,
            width_ft: form.widthFt || null,
            height_ft: form.heightFt || null,
            notes: form.notes || null,
            artwork_path: artworkPath,
          },
        })
        .select("id")
        .single();

      if (insErr) throw new Error(insErr.message);

      const ref = `WW-${String(data.id).slice(0, 8).toUpperCase()}`;
      setRefId(ref);
      trackEvent("wall_wrap_quote_submit", {
        bulk_commercial: bulk,
        has_artwork: Boolean(artworkPath),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (refId) {
    return (
      <div
        className={`rounded-2xl border-2 border-primary/40 bg-card p-6 sm:p-8 shadow-xl ${className}`}
      >
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
          <div className="min-w-0">
            <h3 className="text-xl font-black text-foreground">Quote request received</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Reference <span className="font-mono font-semibold text-foreground">{refId}</span>
              . Our team reviews your artwork and replies with pricing and a production
              timeline.
            </p>
            <div className="mt-4 rounded-lg border border-border bg-muted/40 p-3">
              <p className="text-sm text-foreground font-semibold flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-primary" />
                Checkout is not blocked
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                You can order online right now — this request runs alongside your order, it
                does not hold it.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Button asChild size="lg" className="font-semibold">
                <a href={PRODUCT_URL} target="_top" rel="noopener">
                  Order Wall Wrap now
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="font-semibold"
                onClick={() => {
                  setRefId(null);
                  setFile(null);
                  setBulk(false);
                  setForm({
                    name: "",
                    email: "",
                    phone: "",
                    company: "",
                    widthFt: "",
                    heightFt: "",
                    notes: "",
                  });
                }}
              >
                Submit another
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className={`rounded-2xl border-2 border-border bg-card p-4 sm:p-6 lg:p-8 shadow-xl overflow-x-hidden ${className}`}
    >
      <div className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
        Artwork &amp; Quote Request
      </div>
      <h3 className="text-2xl font-black text-foreground tracking-tight mb-2 text-balance">
        Send your wall wrap artwork
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Upload your file and wall size — we confirm pricing, panel layout, and turnaround.
        This does not block checkout: you can place your order online at any time.
      </p>

      {/* Upload */}
      <div className="mb-5">
        <Label className="text-sm font-semibold">Artwork file (optional)</Label>
        {!file ? (
          <div className="relative mt-2 border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 rounded-xl p-6 text-center transition-colors">
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.tif,.tiff,.pdf,.ai,.eps,.zip"
              onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Upload artwork file"
            />
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm font-medium text-foreground">Click or drop your file</p>
            <p className="text-xs text-muted-foreground mt-1">
              JPG, PNG, TIFF, PDF, AI/EPS or ZIP — up to 100MB
            </p>
          </div>
        ) : (
          <div className="mt-2 flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3">
            <FileImage className="h-5 w-5 text-primary shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFile(null)}
              aria-label="Remove file"
              className="p-1.5 rounded-full hover:bg-destructive/10 text-destructive"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Fields */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ww-name">Name *</Label>
          <Input
            id="ww-name"
            className="h-11 mt-1"
            value={form.name}
            maxLength={100}
            onChange={(e) => set("name", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="ww-email">Email *</Label>
          <Input
            id="ww-email"
            type="email"
            className="h-11 mt-1"
            value={form.email}
            maxLength={255}
            onChange={(e) => set("email", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="ww-phone">Phone</Label>
          <Input
            id="ww-phone"
            type="tel"
            className="h-11 mt-1"
            value={form.phone}
            maxLength={30}
            onChange={(e) => set("phone", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="ww-company">Company</Label>
          <Input
            id="ww-company"
            className="h-11 mt-1"
            value={form.company}
            maxLength={120}
            onChange={(e) => set("company", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="ww-width">Wall width (ft)</Label>
          <Input
            id="ww-width"
            inputMode="decimal"
            className="h-11 mt-1"
            value={form.widthFt}
            onChange={(e) => set("widthFt", e.target.value.replace(/[^0-9.]/g, ""))}
          />
        </div>
        <div>
          <Label htmlFor="ww-height">Wall height (ft)</Label>
          <Input
            id="ww-height"
            inputMode="decimal"
            className="h-11 mt-1"
            value={form.heightFt}
            onChange={(e) => set("heightFt", e.target.value.replace(/[^0-9.]/g, ""))}
          />
        </div>
      </div>

      <div className="mt-4">
        <Label htmlFor="ww-notes">Project notes</Label>
        <Textarea
          id="ww-notes"
          className="mt-1"
          rows={3}
          maxLength={1000}
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Install date, surface type, panel preferences, artwork link…"
        />
      </div>

      {/* Bulk / commercial */}
      <div className="mt-4 flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3">
        <Checkbox
          id="ww-bulk"
          checked={bulk}
          onCheckedChange={(v) => setBulk(v === true)}
          className="mt-0.5"
        />
        <Label htmlFor="ww-bulk" className="cursor-pointer font-normal">
          <span className="block text-sm font-semibold text-foreground">
            This is a bulk / commercial order
          </span>
          <span className="block text-xs text-muted-foreground mt-0.5">
            Multi-room, multi-location, or repeat volume — we apply commercial tier pricing.
          </span>
        </Label>
      </div>

      {error && (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <Button type="submit" size="lg" className="font-semibold" disabled={submitting}>
          {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {submitting ? "Sending…" : "Send artwork & request quote"}
        </Button>
        <Button asChild size="lg" variant="outline" className="font-semibold">
          <a href={PRODUCT_URL} target="_top" rel="noopener">
            Or order online now
          </a>
        </Button>
      </div>

      <p className="mt-3 text-xs text-muted-foreground flex items-start gap-2">
        <ShoppingCart className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary" />
        Checkout is never blocked by this form — ordering online stays available whether or
        not you send artwork here first.
      </p>
    </form>
  );
};

export default WallWrapQuoteForm;
