import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Layers } from 'lucide-react';
import { SceneVisualizer, DesignLibrary, DesignUploader, WallPricingCalculator, WallDesign } from '@/components/wallgraphics';

const WallGraphics = () => {
  const [selectedDesign, setSelectedDesign] = useState<WallDesign | null>(null);
  const [customDesignName, setCustomDesignName] = useState<string | undefined>();
  const [wallWidth, setWallWidth] = useState(48);
  const [wallHeight, setWallHeight] = useState(48);
  
  const designLibraryRef = useRef<HTMLDivElement>(null);

  const handleSelectWall = () => {
    designLibraryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectDesign = (design: WallDesign) => {
    setSelectedDesign(design);
    setCustomDesignName(undefined);
  };

  const handleUpload = (uploadedDesign: any) => {
    if (uploadedDesign) {
      setSelectedDesign(null);
      setCustomDesignName(uploadedDesign.file.name);
    } else {
      setCustomDesignName(undefined);
    }
  };

  const handleDimensionsChange = (width: number, height: number) => {
    setWallWidth(width);
    setWallHeight(height);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <span className="font-bold">Wall Graphics</span>
          </div>
          <div className="w-16" />
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            The Modern Alternative to Wallpaper
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Premium Avery 2610 vinyl • Ready to Install • Removable & Reusable
          </p>
          <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold text-xl">
            $3.25/sq ft
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Scene Visualizer */}
        <section>
          <h2 className="text-2xl font-bold mb-4">1. Preview in Your Space</h2>
          <p className="text-muted-foreground mb-6">Click on the wall to select a design and see it in context</p>
          <SceneVisualizer selectedDesign={selectedDesign} onSelectWall={handleSelectWall} />
        </section>

        {/* Design Selection Grid */}
        <div ref={designLibraryRef} className="grid lg:grid-cols-3 gap-8">
          {/* Design Library */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">2. Choose Your Design</h2>
              <p className="text-muted-foreground mb-6">Browse 55+ designs across 11 categories or upload your own</p>
              <DesignLibrary selectedDesign={selectedDesign} onSelectDesign={handleSelectDesign} />
            </section>

            {/* Upload Section */}
            <DesignUploader onUpload={handleUpload} wallWidth={wallWidth} wallHeight={wallHeight} />
          </div>

          {/* Pricing Calculator - Sticky */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <h2 className="text-2xl font-bold mb-4">3. Get Your Price</h2>
              <WallPricingCalculator
                selectedDesign={selectedDesign}
                customDesignName={customDesignName}
                onDimensionsChange={handleDimensionsChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 We Print Wraps. Premium wall graphics printed on Avery 2610.</p>
        </div>
      </footer>
    </div>
  );
};

export default WallGraphics;
