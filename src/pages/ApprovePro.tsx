import { ArrowLeft, Layers, Eye, Camera, FileImage, CheckCircle, Building2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApproveProUploader, ApproveProDashboard } from "@/components/commercial";
import proof2D from "@/assets/approvepro-2d-proof.png";
import proof3D from "@/assets/approvepro-3d-proof.png";

const WHATS_INCLUDED = [
  { icon: Camera, text: "1 photorealistic 3D Commercial Proof per job" },
  { icon: FileImage, text: "Generated from a provided or approved 2D design" },
  { icon: Eye, text: "Front, rear, driver, and passenger views" },
  { icon: Layers, text: "Accurate proportions and lighting" },
  { icon: Building2, text: "Client or shop branding locked in the bottom-right corner" },
  { icon: CheckCircle, text: "Approval-ready presentation for stakeholders" },
];

const ApprovePro = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to CommercialPro</span>
              </Link>
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold text-navy tracking-tight">ApprovePro</span>
              <span className="text-xl font-bold text-primary tracking-tight">Plus</span>
              <span className="text-primary text-xs font-bold ml-0.5">™</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-background py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <span className="inline-block text-xs font-medium tracking-widest uppercase text-primary mb-3">
                CommercialPro Feature
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                2D to 3D Proofing
                <span className="block text-primary">Made Simple</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Upload your 2D wrap design and get a photorealistic 3D vehicle preview. 
                Perfect for client approvals and stakeholder presentations.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <a href="#upload">
                    Request 3D Proof
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#dashboard">View My Requests</a>
                </Button>
              </div>
            </div>

            {/* Visual Preview */}
            <div className="relative">
              <div className="space-y-4">
                {/* 2D Preview */}
                <div className="relative">
                  <div className="absolute -top-2 left-3 z-10">
                    <span className="bg-muted text-muted-foreground text-xs font-medium px-2 py-0.5 rounded-full border border-border">
                      2D Input
                    </span>
                  </div>
                  <div className="aspect-[16/10] rounded-lg border border-border overflow-hidden bg-muted shadow-sm">
                    <img 
                      src={proof2D} 
                      alt="2D wrap proof layout" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center py-1">
                  <div className="flex items-center gap-2 text-primary">
                    <ArrowRight className="w-4 h-4 rotate-90" />
                  </div>
                </div>

                {/* 3D Preview */}
                <div className="relative">
                  <div className="absolute -top-2 left-3 z-10">
                    <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                      3D Output
                    </span>
                  </div>
                  <div className="aspect-[16/10] rounded-lg border-2 border-primary/30 overflow-hidden shadow-lg">
                    <img 
                      src={proof3D} 
                      alt="Photorealistic 3D vehicle wrap proof" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-12 border-y border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-lg font-semibold text-foreground text-center mb-8">
            What's Included with Every Proof
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WHATS_INCLUDED.map((item) => (
              <div key={item.text} className="flex items-center gap-3 bg-background p-4 rounded-lg border border-border">
                <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm text-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upload & Dashboard Section */}
      <section id="upload" className="py-16 lg:py-20 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-6">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="upload" className="text-base">
                <FileImage className="w-4 h-4 mr-2" />
                Request New Proof
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="text-base">
                <Eye className="w-4 h-4 mr-2" />
                My Requests
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-0">
              <div className="bg-muted/30 border border-border rounded-2xl p-6 lg:p-8">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Submit Your 2D Design
                </h3>
                <p className="text-muted-foreground mb-6">
                  Upload your wrap design and we'll generate a photorealistic 3D proof within 24-48 hours.
                </p>
                <ApproveProUploader />
              </div>
            </TabsContent>

            <TabsContent value="dashboard" id="dashboard" className="mt-0 scroll-mt-20">
              <div className="bg-muted/30 border border-border rounded-2xl p-6 lg:p-8">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Your Proof Requests
                </h3>
                <p className="text-muted-foreground mb-6">
                  Track the status of your 3D proof requests and download approved proofs.
                </p>
                <ApproveProDashboard />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-navy py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-navy-foreground mb-3">
            Need Help with Your Proof?
          </h2>
          <p className="text-navy-foreground/70 mb-6">
            Our team is here to assist with any questions about the proofing process.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <a href="mailto:hello@weprintwraps.com">Contact Support</a>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ApprovePro;
