import { Truck, Shield, ChevronRight, Phone, Mail, Upload, DollarSign, Zap, LayoutDashboard, MessageCircle, Grid, TrendingDown } from "lucide-react";
import { Link } from "react-router-dom";
import {
  CommercialInfoStrip,
  BulkPricingSection,
  PricingUpdateExplainer,
  ApproveProPlusSection,
  CommercialFooter,
  TestimonialSection,
  JacksonQuoteEmbed,
  StickyQuoteBar,
  QuoteWelcomeBanner,
  ProUpgradeStrip,
  SalesAgentDrawer,
  VoiceAgentButton,
  TrustLogosStrip,
  ProductSlider,
  PromoCodesSection,
} from "@/components/commercial";
import { Button } from "@/components/ui/button";
import heroFleet from "@/assets/hero-fleet.jpg";
import logoWpw from "@/assets/logo-wpw.png";
import premiumGuaranteeBadge from "@/assets/premium-wrap-guarantee-gold.png";

const VALUE_PROPS = [
  { icon: Shield, label: "Premium Wrap Guarantee", desc: "Print flaws reprinted free" },
  { icon: Zap, label: "1-2 Day Production", desc: "Lightning fast turnaround" },
  { icon: Upload, label: "Upload & Buy Online", desc: "Easy file submission" },
  { icon: DollarSign, label: "Wholesale Prices", desc: "Commercial rates" },
  { icon: Truck, label: "3M at Lower Prices", desc: "Premium materials, everyday pricing" },
  { icon: Grid, label: "Command Center", desc: "Quotes • Files • Proofs", link: "/commercial/command-center", badge: "WrapCommand™" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Quote Welcome Banner - shows when coming from WPW with quote_id */}
      <QuoteWelcomeBanner />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm shadow-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <a href="/" className="flex items-center gap-3">
                <img src={logoWpw} alt="WePrintWraps" className="h-10 w-auto" />
                <div className="flex items-baseline gap-0.5">
                  <span className="text-base font-bold text-navy tracking-tight">Commercial</span>
                  <span className="text-base font-bold text-primary tracking-tight">Pro</span>
                  <span className="text-primary text-[10px] font-bold ml-0.5">™</span>
                </div>
              </a>
              
              {/* Nav Links */}
              <nav className="hidden md:flex items-center gap-6">
                <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </a>
                <a href="#volume" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                  Volume Pricing
                </a>

                <a href="#promo-codes" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Promo Codes
                </a>
                <Link to="/wall-wraps" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Wall Wraps
                </Link>
                <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Success Stories
                </a>
              </nav>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-4">
              <VoiceAgentButton className="hidden sm:flex" />
              <SalesAgentDrawer
                trigger={
                  <button className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    <span>Chat</span>
                  </button>
                }
              />
              <Button size="sm" className="font-medium" asChild>
                <a href="#pricing">
                  Get Quote
                  <ChevronRight className="h-4 w-4 ml-1" />
                </a>
              </Button>
            </div>
          </div>
        </div>
        {/* Blue break under header */}
        <div className="h-1 bg-gradient-to-r from-primary via-primary to-primary/50" />
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[600px] lg:min-h-[700px] overflow-hidden">
        {/* Full-width background image */}
        <div className="absolute inset-0">
          <img 
            src={heroFleet} 
            alt="Fleet of professionally wrapped commercial vehicles" 
            className="w-full h-full object-cover object-center brightness-125 contrast-105"
          />
          {/* Lighter gradient overlay — keeps text readable without hiding the fleet */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/35 to-slate-950/60 lg:bg-gradient-to-r lg:from-slate-950/85 lg:via-slate-950/45 lg:via-45% lg:to-slate-950/10" />
          {/* Image credit caption */}
          <p className="absolute bottom-2 right-4 text-xs text-white/50 italic z-10">
            Image is a fleet done by VikingFleet Prescott, Arizona using WePrintWraps.com for printing.
          </p>
        </div>

        {/* Content overlay */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left side - Hero text + value props */}
            <div className="pt-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-4">
                Professional Wraps
                <br />
                <span className="text-white">Built for Business</span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-5 max-w-xl">
                Built for wrap shops that don't own printers. Wholesale pricing, volume discounts, and 3D proofs that sell jobs.
              </p>

              {/* Bulk pricing hook */}
              <a
                href="#volume"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 mb-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors"
              >
                <TrendingDown className="h-4 w-4" />
                Save up to 20% on volume orders
                <ChevronRight className="h-4 w-4 opacity-80" />
              </a>

              {/* Quick value props */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 text-white/90">
                  <Shield className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm">Premium Wrap Guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Zap className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm">1-2 Day Production</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <DollarSign className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm">From $4.22/sq ft at 2,500+ sq ft</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Truck className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm">3M Premium Materials</span>
                </div>
              </div>


              {/* Premium Wrap Guarantee Badge */}
              <div className="flex items-center gap-4 rounded-xl border border-white/15 bg-slate-950/50 backdrop-blur-sm px-4 py-3 max-w-md">
                <img 
                  src={premiumGuaranteeBadge} 
                  alt="Premium Wrap Guarantee" 
                  className="h-20 md:h-24 w-auto drop-shadow-lg flex-shrink-0"
                />
                <p className="text-sm md:text-base font-medium text-white leading-snug">
                  Print flaws reprinted at no cost. Quality guaranteed.
                </p>
              </div>
            </div>

            {/* Right side - Quote Tool Embed */}
            <div className="lg:pt-2">
              <JacksonQuoteEmbed className="shadow-2xl shadow-black/30" />
            </div>
          </div>

        </div>
      </section>

      {/* Fleet Promo Codes — above the fold priority */}
      <section id="promo-codes" className="scroll-mt-20">
        <PromoCodesSection />
      </section>


      {/* Value Props - 6 items with bold gradient */}
      <section className="border-y border-border bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
        {/* Top gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {VALUE_PROPS.map(({ icon: Icon, label, desc, link, badge }) => {
              const content = (
                <div className={`flex flex-col items-center text-center gap-3 p-4 ${link ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 relative">
                    <Icon className="h-6 w-6 text-white" />
                    {badge && (
                      <span className="absolute -top-1 -right-1 bg-primary text-[8px] text-primary-foreground px-1.5 py-0.5 rounded-full font-medium">
                        ★
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm leading-tight">{label}</p>
                    <p className="text-blue-100 text-xs mt-1">{desc}</p>
                    {badge && (
                      <p className="text-primary text-[10px] mt-1 font-medium">{badge}</p>
                    )}
                  </div>
                </div>
              );
              
              return link ? (
                <Link key={label} to={link}>{content}</Link>
              ) : (
                <div key={label}>{content}</div>
              );
            })}
          </div>
        </div>
        
        {/* Bottom gradient accent */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
      </section>

      {/* Trust Logos Strip - Manufacturer Badges */}
      <TrustLogosStrip />

      {/* Commercial Info Strip */}
      <CommercialInfoStrip />

      {/* Shop Our Products — live WooCommerce slider */}
      <section id="shop" className="scroll-mt-20 border-y border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-2">
                <Grid className="h-3.5 w-3.5" />
                From Our Store
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                Shop Our Products
              </h2>
              <p className="text-muted-foreground text-sm mt-1 max-w-xl">
                Featured wrap materials and supplies — same wholesale pricing, shipped fast.
              </p>
            </div>
          </div>
          <ProductSlider sort="featured" count={12} />
        </div>
      </section>



      {/* Volume Pricing Section - lead pricing content */}
      <section id="volume" className="scroll-mt-20">
        <BulkPricingSection />
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="scroll-mt-20">
        <PricingUpdateExplainer />
      </section>


      {/* Testimonials Section */}
      <section id="testimonials" className="scroll-mt-20">
        <TestimonialSection />
      </section>

      {/* Pro Upgrade Strip - CommercialPro + RestylePro */}
      <section className="bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Upgrade Your Wrap Game
            </h2>
            <p className="text-muted-foreground text-sm">
              Professional tools for wrap shops ready to level up
            </p>
          </div>
          <ProUpgradeStrip />
        </div>
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
              <VoiceAgentButton variant="hero" />
              <SalesAgentDrawer
                trigger={
                  <Button size="lg" variant="outline" className="text-base px-8 border-navy-foreground/30 bg-navy-foreground text-navy hover:bg-navy-foreground/90 hover:text-navy">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Chat with Sales
                  </Button>
                }
              />
              <Button size="lg" className="text-base px-8 bg-white text-navy hover:bg-white/90 shadow-lg shadow-black/20" asChild>
                <a href="mailto:commercial@weprintwraps.com">
                  <Mail className="h-5 w-5 mr-2" />
                  Email Us
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <CommercialFooter />

      {/* Sticky Quote Bar - event-driven states */}
      <StickyQuoteBar />
    </div>
  );
};

export default Index;
