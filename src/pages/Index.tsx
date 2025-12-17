import { Building2, Truck, Shield, Clock, ChevronRight, Phone, Mail } from "lucide-react";
import {
  CommercialInfoStrip,
  BulkPricingSection,
  PricingUpdateExplainer,
  ApproveProPlusSection,
  CommercialFooter,
} from "@/components/commercial";
import { Button } from "@/components/ui/button";
import heroFleet from "@/assets/hero-fleet.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <a href="/" className="flex items-baseline gap-0.5">
                <span className="text-xl font-bold text-navy tracking-tight">WPWCommercial</span>
                <span className="text-xl font-bold text-primary tracking-tight">Pro</span>
                <span className="text-primary text-xs font-bold ml-0.5">™</span>
              </a>
              
              {/* Nav Links */}
              <nav className="hidden md:flex items-center gap-6">
                <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </a>
                <a href="#volume" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Volume Discounts
                </a>
                <a href="#proofing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  3D Proofing
                </a>
              </nav>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-4">
              <a href="tel:1-800-example" className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <Phone className="h-4 w-4" />
                <span>Contact Sales</span>
              </a>
              <Button size="sm" className="font-medium">
                Get Quote
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-secondary/50 to-background">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium mb-6">
                <Building2 className="h-4 w-4" />
                Fleet & Commercial Wraps
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy tracking-tight leading-[1.1] mb-6">
                Professional Wraps
                <br />
                <span className="text-primary">Built for Business</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-xl">
                Wholesale pricing, volume discounts, and dedicated account support for fleet managers, installers, and commercial buyers.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-base px-8">
                  Request Volume Quote
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="text-base px-8">
                  <Mail className="h-5 w-5 mr-2" />
                  hello@weprintwraps.com
                </Button>
              </div>
            </div>

            {/* Right - Hero Image */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-border/50">
                <img 
                  src={heroFleet} 
                  alt="Fleet of professionally wrapped commercial vehicles" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Subtle accent */}
              <div className="absolute -z-10 inset-4 bg-primary/10 rounded-2xl blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="border-y border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Truck, label: "Wholesale Pricing", desc: "Commercial rates" },
              { icon: Clock, label: "Fast Turnaround", desc: "Fleet-ready speed" },
              { icon: Shield, label: "Professional Grade", desc: "Premium 3M materials" },
              { icon: Building2, label: "No Minimums", desc: "Any order size" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{label}</p>
                  <p className="text-muted-foreground text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commercial Info Strip */}
      <CommercialInfoStrip />

      {/* Pricing Section */}
      <section id="pricing" className="scroll-mt-20">
        <PricingUpdateExplainer />
      </section>

      {/* Volume Pricing Section */}
      <section id="volume" className="scroll-mt-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Volume Discounts
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The more you order, the more you save. Automatic tier pricing for fleet and bulk orders.
            </p>
          </div>
          <BulkPricingSection />
        </div>
      </section>

      {/* 3D Proofing Section */}
      <section id="proofing" className="scroll-mt-20">
        <ApproveProPlusSection />
      </section>

      {/* CTA Section */}
      <section className="bg-navy">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-navy-foreground mb-2">
                Ready to scale your fleet graphics?
              </h2>
              <p className="text-navy-foreground/70">
                Contact our commercial team for volume pricing and account setup.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="secondary" className="text-base px-8">
                <Phone className="h-5 w-5 mr-2" />
                Call Sales
              </Button>
              <Button size="lg" className="text-base px-8 bg-white text-navy hover:bg-white/90">
                <Mail className="h-5 w-5 mr-2" />
                Email Quote Request
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <CommercialFooter />
    </div>
  );
};

export default Index;
