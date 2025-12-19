import { useState, useMemo } from 'react';
import { Calculator, ShoppingCart, Check, Truck, Shield, Scissors, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WallDesign } from './designData';

interface WallPricingCalculatorProps {
  selectedDesign: WallDesign | null;
  customDesignName?: string;
  onDimensionsChange: (width: number, height: number) => void;
}

const BASE_PRICE_PER_SQFT = 3.25;

const volumeDiscounts = [
  { minSqFt: 0, discount: 0, label: 'Standard Pricing' },
  { minSqFt: 250, discount: 0.05, label: '5% Off (250+ sq ft)' },
  { minSqFt: 500, discount: 0.10, label: '10% Off (500+ sq ft)' },
  { minSqFt: 750, discount: 0.15, label: '15% Off (750+ sq ft)' },
  { minSqFt: 1000, discount: 0.20, label: '20% Off (1000+ sq ft)' },
];

const valueProps = [
  { icon: Scissors, text: 'Ready to Install - Pre-cut & pre-weeded' },
  { icon: Shield, text: 'Premium Wrap Guarantee' },
  { icon: Check, text: 'Removable - No paste, no damage' },
  { icon: Truck, text: 'Any Size, No Minimums' },
  { icon: Clock, text: '1-2 Day Production' },
];

const WallPricingCalculator = ({ 
  selectedDesign, 
  customDesignName,
  onDimensionsChange 
}: WallPricingCalculatorProps) => {
  const [widthInches, setWidthInches] = useState<number>(48);
  const [heightInches, setHeightInches] = useState<number>(48);

  const calculations = useMemo(() => {
    const sqFt = (widthInches * heightInches) / 144;
    const applicableDiscount = [...volumeDiscounts]
      .reverse()
      .find((d) => sqFt >= d.minSqFt) || volumeDiscounts[0];
    
    const basePrice = sqFt * BASE_PRICE_PER_SQFT;
    const discountAmount = basePrice * applicableDiscount.discount;
    const finalPrice = basePrice - discountAmount;

    return {
      sqFt: sqFt.toFixed(2),
      basePrice: basePrice.toFixed(2),
      discountPercent: applicableDiscount.discount * 100,
      discountLabel: applicableDiscount.label,
      discountAmount: discountAmount.toFixed(2),
      finalPrice: finalPrice.toFixed(2),
    };
  }, [widthInches, heightInches]);

  const handleWidthChange = (value: number) => {
    setWidthInches(value);
    onDimensionsChange(value, heightInches);
  };

  const handleHeightChange = (value: number) => {
    setHeightInches(value);
    onDimensionsChange(widthInches, value);
  };

  const handleAddToCart = () => {
    const designName = selectedDesign?.name || customDesignName || 'Custom Design';
    const productId = 'wall-graphic'; // Replace with actual WooCommerce product ID
    const wooCommerceUrl = `https://weprintwraps.com/?add-to-cart=${productId}&width=${widthInches}&height=${heightInches}&design=${encodeURIComponent(designName)}&sqft=${calculations.sqFt}`;
    window.open(wooCommerceUrl, '_blank');
  };

  const displayDesign = selectedDesign?.name || customDesignName || 'Select a design';

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/30">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Pricing Calculator
        </h3>
        <p className="text-2xl font-bold text-primary mt-1">${BASE_PRICE_PER_SQFT}/sq ft</p>
      </div>

      <div className="p-4 space-y-6">
        {/* Selected Design */}
        <div className="bg-muted/30 rounded-xl p-3">
          <Label className="text-xs text-muted-foreground mb-1 block">Selected Design</Label>
          <div className="flex items-center gap-3">
            {selectedDesign ? (
              <>
                <img
                  src={selectedDesign.imageUrl}
                  alt={selectedDesign.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <span className="font-medium">{selectedDesign.name}</span>
              </>
            ) : customDesignName ? (
              <span className="font-medium">{customDesignName}</span>
            ) : (
              <span className="text-muted-foreground">No design selected</span>
            )}
          </div>
        </div>

        {/* Dimensions */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="width" className="text-sm mb-1.5 block">Width (inches)</Label>
            <Input
              id="width"
              type="number"
              min={12}
              max={600}
              value={widthInches}
              onChange={(e) => handleWidthChange(Number(e.target.value))}
              className="text-lg font-medium"
            />
          </div>
          <div>
            <Label htmlFor="height" className="text-sm mb-1.5 block">Height (inches)</Label>
            <Input
              id="height"
              type="number"
              min={12}
              max={600}
              value={heightInches}
              onChange={(e) => handleHeightChange(Number(e.target.value))}
              className="text-lg font-medium"
            />
          </div>
        </div>

        {/* Quick Size Presets */}
        <div>
          <Label className="text-sm mb-2 block text-muted-foreground">Quick Sizes</Label>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "4'×4'", w: 48, h: 48 },
              { label: "4'×8'", w: 48, h: 96 },
              { label: "8'×8'", w: 96, h: 96 },
              { label: "8'×10'", w: 96, h: 120 },
              { label: "10'×12'", w: 120, h: 144 },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  setWidthInches(preset.w);
                  setHeightInches(preset.h);
                  onDimensionsChange(preset.w, preset.h);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  widthInches === preset.w && heightInches === preset.h
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-muted/30 rounded-xl p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Square Footage</span>
            <span className="font-medium">{calculations.sqFt} sq ft</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Base Price</span>
            <span className="font-medium">${calculations.basePrice}</span>
          </div>
          {calculations.discountPercent > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>{calculations.discountLabel}</span>
              <span>-${calculations.discountAmount}</span>
            </div>
          )}
          <div className="border-t border-border pt-3 flex justify-between">
            <span className="font-semibold">Total</span>
            <span className="text-2xl font-bold text-primary">${calculations.finalPrice}</span>
          </div>
        </div>

        {/* Volume Discount Tiers */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium text-foreground mb-2">Volume Discounts:</p>
          {volumeDiscounts.slice(1).map((tier) => (
            <div key={tier.minSqFt} className="flex justify-between">
              <span>{tier.minSqFt}+ sq ft</span>
              <span className="text-green-600">{tier.discount * 100}% off</span>
            </div>
          ))}
        </div>

        {/* Add to Cart */}
        <Button
          onClick={handleAddToCart}
          size="lg"
          className="w-full text-lg h-14"
          disabled={!selectedDesign && !customDesignName}
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Add to Cart - ${calculations.finalPrice}
        </Button>

        {/* Value Props */}
        <div className="space-y-2 pt-2">
          {valueProps.map((prop, index) => (
            <div key={index} className="flex items-center gap-3 text-sm">
              <prop.icon className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-muted-foreground">{prop.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WallPricingCalculator;
