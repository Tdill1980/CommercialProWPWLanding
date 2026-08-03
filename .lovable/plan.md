## Goal

Make bulk/volume pricing a headline message on the CommercialPro homepage instead of a mid-page section, keeping the existing transparent, calculation-first presentation.

## Current state (verified)

- `src/pages/Index.tsx` renders `BulkPricingSection` inside `<section id="volume">`, positioned after the hero, value grid, trust logos, info strip, and the pricing explainer — roughly halfway down the page.
- `src/components/commercial/BulkPricingSection.tsx` already has the savings calculator, tier table with real $/sq ft, and a savings figure. Base price $5.27, tiers at 250/500/1,000/2,500 sq ft (5/10/15/20%).
- The hero's four trust bullets include a generic "wholesale pricing"-style item; there is no bulk-specific hook above the fold.
- Top nav has ApprovePro and Wall Wraps links only — no jump link to the volume section.

## Changes

1. **Hero bulk hook (above the fold)**
   - Add a compact "Save up to 20% on volume orders" badge/line in the hero copy block, linking to `#volume`.
   - Reframe the pricing-related hero bullet to name the actual number ("From $4.22/sq ft at 2,500+ sq ft") rather than a vague wholesale claim.

2. **Promote the section**
   - Move `<section id="volume">` above `PricingUpdateExplainer` so volume pricing is the first pricing content after the trust strip.
   - Give the section stronger visual weight: full-width contrast background and a larger headline treatment so it reads as a primary section, not a card block.

3. **Nav + wayfinding**
   - Add a "Volume Pricing" link in the header nav (and the mobile menu, if present) pointing to `#volume`.

4. **Inside `BulkPricingSection`**
   - Lead with the savings headline: show the max-tier price ($4.22/sq ft) alongside base price in the header.
   - Add a "next tier" nudge under the calculator: e.g. "Add 180 sq ft to unlock 15% off" when the entered size is below the next threshold.
   - Show the full tier table including the 0% row so the ladder is legible, with the active tier highlighted (already implemented).

5. **Sticky bar reinforcement**
   - `StickyQuoteBar` already carries AOV nudges; align its copy with the tier thresholds used here so the numbers match.

## Technical notes

- Presentation-only work in `src/pages/Index.tsx`, `src/components/commercial/BulkPricingSection.tsx`, and `StickyQuoteBar` copy. No pricing logic, backend, or checkout changes — the calculator stays an estimator, and the existing disclaimer stays.
- All colors via existing semantic tokens (`primary`, `success`, `navy`, `muted`); no hardcoded color utilities.

## Still open (separate from this)

The quote tool embed on the homepage is currently showing its placeholder because `VITE_QUOTE_TOOL_URL` is not set. I still need the live URL of Jackson's Quote Builder to wire that up — it is not part of this bulk-pricing work.
