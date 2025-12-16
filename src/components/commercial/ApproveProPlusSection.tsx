import { Check, Layers, Eye, Building2, RotateCcw } from "lucide-react";

/**
 * ApproveProPlusSection
 * 
 * Explainer section for CommercialPro's ApprovePro Plus 2D→3D proof system.
 * Visual placeholder included — swap imagery as needed.
 * 
 * Standalone, modular component for WePrintWraps CommercialPro.
 */

const FEATURES = [
  {
    icon: Layers,
    title: "2D to 3D Commercial Proof",
    description: "Your flat design converted to a realistic 3D vehicle mockup",
  },
  {
    icon: Eye,
    title: "All Sides Shown",
    description: "Front, back, sides, and angles for complete approval confidence",
  },
  {
    icon: Building2,
    title: "Client Branding",
    description: "Your shop or client logo locked in bottom-right for presentation",
  },
  {
    icon: RotateCcw,
    title: "Fleet & Repeat Ready",
    description: "Built for bulk approvals and ongoing production runs",
  },
];

export const ApproveProPlusSection = () => {
  return (
    <section className="w-full bg-background py-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-medium tracking-widest uppercase text-primary mb-3">
            CommercialPro Feature
          </span>
          <h2 className="text-3xl font-semibold text-foreground mb-4">
            ApprovePro Plus
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            CommercialPro includes ApprovePro Plus, which converts your 2D design
            into a branded 3D approval proof showing all sides of the vehicle.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Visual Placeholder */}
          <div className="relative">
            <div className="aspect-[4/3] bg-muted rounded-xl border border-border overflow-hidden flex items-center justify-center">
              {/* Placeholder for 3D proof visualization */}
              <div className="text-center p-8">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                  <Layers className="w-10 h-10 text-primary" />
                </div>
                <p className="text-muted-foreground text-sm">
                  3D Proof Preview
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  [Image swap: commercial van 3D mockup]
                </p>
              </div>
            </div>
            {/* Brand badge indicator */}
            <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm border border-border rounded px-3 py-1.5 text-xs text-muted-foreground">
              Your Logo Here
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-6">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground bg-muted/50 inline-block px-6 py-3 rounded-full">
            Approval preview — final production follows approved proof.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ApproveProPlusSection;