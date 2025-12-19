import { Building2, Truck, Shield, Clock, ChevronRight, Phone, Mail, Upload, DollarSign, Zap, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import {
  CommercialInfoStrip,
  BulkPricingSection,
  PricingUpdateExplainer,
  ApproveProPlusSection,
  CommercialFooter,
  TestimonialSection,
} from "@/components/commercial";
import { Button } from "@/components/ui/button";
import heroFleet from "@/assets/hero-fleet.jpg";

const VALUE_PROPS = [
  { icon: Shield, label: "Premium Wrap Guarantee", desc: "Print flaws reprinted free" },
  { icon: Zap, label: "1-2 Day Production", desc: "Lightning fast turnaround" },
  { icon: Upload, label: "Upload & Buy Online", desc: "Easy file submission" },
  { icon: DollarSign, label: "Wholesale Prices", desc: "Commercial rates" },
  { icon: Truck, label: "3M at Lower Prices", desc: "Premium materials, everyday pricing" },
  { icon: LayoutDashboard, label: "CommercialPro Dashboard", desc: "Dedicated account portal" },
];

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
                <Link to="/approvepro" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  ApprovePro
                </Link>
                <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Success Stories
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
      <section className="relative min-h-[500px] lg:min-h-[550px] overflow-hidden">
        {/* Full-width background image */}
        <div className="absolute inset-0">
          <img 
            src={heroFleet} 
            alt="Fleet of professionally wrapped commercial vehicles" 
            className="w-full h-full object-cover object-center"
          />
          {/* Strong gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 via-40% to-slate-950/20" />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="max-w-2xl">
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6">
              Professional Wraps
              <br />
              <span className="text-white">Built for Business</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-8 max-w-xl">
              Wholesale pricing, volume discounts, and dedicated account support for fleet managers, installers, and commercial buyers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-base px-8">
                Request Volume Quote
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 bg-white/10 border-white/30 text-white hover:bg-white/20">
                <Mail className="h-5 w-5 mr-2" />
                hello@weprintwraps.com
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props - 6 items with bold gradient */}
      <section className="border-y border-border bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
        {/* Top gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {VALUE_PROPS.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex flex-col items-center text-center gap-3 p-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm leading-tight">{label}</p>
                  <p className="text-blue-200/70 text-xs mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Bottom gradient accent */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
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

      {/* Testimonials Section */}
      <section id="testimonials" className="scroll-mt-20">
        <TestimonialSection />
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
