import { Layers, Eye, Building2, Camera, CheckCircle, FileImage } from "lucide-react";

/**
 * ApproveProPlusSection
 * 
 * Explainer section for CommercialPro's ApprovePro Plus 2D→3D proof system.
 * Visual placeholder included — swap imagery as needed.
 * 
 * Standalone, modular component for WePrintWraps CommercialPro.
 */

const WHATS_INCLUDED = [
  {
    icon: Camera,
    text: "1 photorealistic 3D Commercial Proof per job",
  },
  {
    icon: FileImage,
    text: "Generated from a provided or approved 2D design",
  },
  {
    icon: Eye,
    text: "Front, rear, driver, and passenger views",
  },
  {
    icon: Layers,
    text: "Accurate proportions and lighting",
  },
  {
    icon: Building2,
    text: "Client or shop branding locked in the bottom-right corner",
  },
  {
    icon: CheckCircle,
    text: "Approval-ready presentation for stakeholders",
  },
];

const IMPORTANT_NOTES = [
  "A 2D wrap design is required to generate an ApprovePro Plus proof",
  "ApprovePro Plus does not create or redesign artwork",
  "The 3D proof is used for visual approval, not creative development",
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
            ApprovePro Plus™ (Included with CommercialPro)
          </h2>
          <div className="text-muted-foreground max-w-3xl mx-auto space-y-4">
            <p>
              Every CommercialPro wrap order includes ApprovePro Plus™ — a 2D-to-3D 
              photorealistic commercial approval proof generated from your submitted 
              or approved 2D wrap design.
            </p>
            <p>
              ApprovePro Plus converts an existing 2D layout into a realistic 3D vehicle 
              preview, showing all primary sides so decision-makers can clearly visualize 
              the final result before production.
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
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

          {/* What's Included List */}
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">
                What's Included
              </h3>
              <div className="space-y-4">
                {WHATS_INCLUDED.map((item) => (
                  <div key={item.text} className="flex gap-3 items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-secondary-foreground" />
                    </div>
                    <p className="text-sm text-foreground pt-1">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Important to Know */}
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <h4 className="text-sm font-medium text-foreground mb-3">
                Important to Know
              </h4>
              <ul className="space-y-2">
                {IMPORTANT_NOTES.map((note) => (
                  <li key={note} className="text-xs text-muted-foreground flex gap-2">
                    <span className="text-primary">•</span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-xs text-muted-foreground">
            One ApprovePro Plus 3D commercial proof is included per CommercialPro job. 
            Additional views or versions are available if needed.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ApproveProPlusSection;