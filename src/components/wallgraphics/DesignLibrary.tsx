import { useState } from 'react';
import { wallDesigns, designCategories, getDesignsByCategory, WallDesign } from './designData';
import { Check, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DesignLibraryProps {
  selectedDesign: WallDesign | null;
  onSelectDesign: (design: WallDesign) => void;
}

const DesignLibrary = ({ selectedDesign, onSelectDesign }: DesignLibraryProps) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDesigns = getDesignsByCategory(selectedCategory).filter(
    (design) =>
      design.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      design.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <h3 className="text-lg font-semibold mb-3">Design Library</h3>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search designs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {designCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background hover:bg-muted text-muted-foreground'
              }`}
            >
              {category.name}
              <span className="ml-1 opacity-60">({category.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Design Grid */}
      <div className="p-4 max-h-[500px] overflow-y-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filteredDesigns.map((design) => (
            <button
              key={design.id}
              onClick={() => onSelectDesign(design)}
              className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                selectedDesign?.id === design.id
                  ? 'border-primary ring-2 ring-primary/30 scale-[1.02]'
                  : 'border-transparent hover:border-muted-foreground/30 hover:scale-[1.02]'
              }`}
            >
              <img
                src={design.imageUrl}
                alt={design.name}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="text-white text-xs font-medium truncate">{design.name}</p>
                </div>
              </div>

              {/* Selected Checkmark */}
              {selectedDesign?.id === design.id && (
                <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>

        {filteredDesigns.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No designs found matching your search.</p>
          </div>
        )}
      </div>

      {/* Selected Design Info */}
      {selectedDesign && (
        <div className="p-4 border-t border-border bg-primary/5">
          <div className="flex items-center gap-3">
            <img
              src={selectedDesign.imageUrl}
              alt={selectedDesign.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{selectedDesign.name}</p>
              <p className="text-sm text-muted-foreground truncate">{selectedDesign.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignLibrary;
