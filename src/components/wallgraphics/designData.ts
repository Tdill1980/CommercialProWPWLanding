export interface WallDesign {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  imageUrl: string;
  description: string;
  tags: string[];
}

export const designCategories = [
  { id: 'all', name: 'All Designs', count: 58 },
  { id: 'faux-wood', name: 'Faux Wood', count: 6 },
  { id: 'faux-stone', name: 'Faux Stone', count: 5 },
  { id: 'faux-terrazzo', name: 'Faux Terrazzo', count: 4 },
  { id: 'faux-tile', name: 'Faux Tile', count: 5 },
  { id: 'abstract', name: 'Abstract', count: 5 },
  { id: 'giant-floral', name: 'Giant Floral', count: 4 },
  { id: 'standard-floral', name: 'Standard Floral', count: 4 },
  { id: 'kids-rooms', name: 'Modern Kids Rooms', count: 6 },
  { id: 'automotive', name: 'Automotive', count: 5 },
  { id: 'topography', name: 'Topography', count: 4 },
  { id: 'airbnb', name: 'AirBnB Collection', count: 10 },
];

export const wallDesigns: WallDesign[] = [
  // Faux Wood (6)
  {
    id: 'wood-rustic-barn',
    name: 'Rustic Barn Wood',
    category: 'faux-wood',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    description: 'Weathered barn wood planks with authentic grain texture',
    tags: ['rustic', 'farmhouse', 'warm']
  },
  {
    id: 'wood-white-shiplap',
    name: 'White Shiplap',
    category: 'faux-wood',
    imageUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&q=80',
    description: 'Clean white horizontal planks for coastal or farmhouse style',
    tags: ['coastal', 'modern', 'bright']
  },
  {
    id: 'wood-dark-walnut',
    name: 'Dark Walnut',
    category: 'faux-wood',
    imageUrl: 'https://images.unsplash.com/photo-1541123603104-512919d6a96c?w=800&q=80',
    description: 'Rich dark walnut with elegant grain patterns',
    tags: ['elegant', 'luxury', 'dark']
  },
  {
    id: 'wood-light-oak',
    name: 'Light Oak',
    category: 'faux-wood',
    imageUrl: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&q=80',
    description: 'Scandinavian-inspired light oak wood texture',
    tags: ['scandinavian', 'minimal', 'light']
  },
  {
    id: 'wood-reclaimed-plank',
    name: 'Reclaimed Plank',
    category: 'faux-wood',
    imageUrl: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=800&q=80',
    description: 'Mixed reclaimed wood planks with character',
    tags: ['eclectic', 'vintage', 'textured']
  },
  {
    id: 'wood-weathered-gray',
    name: 'Weathered Gray',
    category: 'faux-wood',
    imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&q=80',
    description: 'Modern gray-washed wood with subtle grain',
    tags: ['modern', 'neutral', 'contemporary']
  },

  // Faux Stone (5)
  {
    id: 'stone-carrara-marble',
    name: 'Carrara Marble',
    category: 'faux-stone',
    imageUrl: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80',
    description: 'Classic Italian white marble with gray veining',
    tags: ['luxury', 'elegant', 'classic']
  },
  {
    id: 'stone-dark-slate',
    name: 'Dark Slate',
    category: 'faux-stone',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    description: 'Dramatic dark slate with natural texture',
    tags: ['dramatic', 'modern', 'dark']
  },
  {
    id: 'stone-exposed-brick',
    name: 'Exposed Red Brick',
    category: 'faux-stone',
    imageUrl: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=800&q=80',
    description: 'Industrial exposed brick wall texture',
    tags: ['industrial', 'loft', 'urban']
  },
  {
    id: 'stone-stacked-ledge',
    name: 'Stacked Ledgestone',
    category: 'faux-stone',
    imageUrl: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80',
    description: 'Horizontal stacked stone for accent walls',
    tags: ['natural', 'textured', 'accent']
  },
  {
    id: 'stone-raw-concrete',
    name: 'Raw Concrete',
    category: 'faux-stone',
    imageUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80',
    description: 'Industrial raw concrete with subtle variations',
    tags: ['industrial', 'minimal', 'modern']
  },

  // Faux Terrazzo (4)
  {
    id: 'terrazzo-classic',
    name: 'Classic Italian Terrazzo',
    category: 'faux-terrazzo',
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    description: 'Traditional Italian terrazzo with marble chips',
    tags: ['classic', 'italian', 'elegant']
  },
  {
    id: 'terrazzo-modern',
    name: 'Modern Minimal',
    category: 'faux-terrazzo',
    imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
    description: 'Subtle modern terrazzo with muted tones',
    tags: ['modern', 'minimal', 'subtle']
  },
  {
    id: 'terrazzo-colorful',
    name: 'Colorful Confetti',
    category: 'faux-terrazzo',
    imageUrl: 'https://images.unsplash.com/photo-1600607687644-c7f34b5063c7?w=800&q=80',
    description: 'Playful terrazzo with vibrant colored chips',
    tags: ['playful', 'colorful', 'fun']
  },
  {
    id: 'terrazzo-earth',
    name: 'Neutral Earth Tones',
    category: 'faux-terrazzo',
    imageUrl: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&q=80',
    description: 'Warm earth-toned terrazzo for organic feel',
    tags: ['warm', 'organic', 'natural']
  },

  // Faux Tile (5)
  {
    id: 'tile-white-subway',
    name: 'White Subway Tile',
    category: 'faux-tile',
    imageUrl: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80',
    description: 'Classic white subway tile pattern',
    tags: ['classic', 'clean', 'kitchen']
  },
  {
    id: 'tile-black-hex',
    name: 'Black Hexagon',
    category: 'faux-tile',
    imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
    description: 'Modern black hexagonal tile pattern',
    tags: ['modern', 'geometric', 'bold']
  },
  {
    id: 'tile-moroccan',
    name: 'Moroccan Pattern',
    category: 'faux-tile',
    imageUrl: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80',
    description: 'Intricate Moroccan-inspired tile design',
    tags: ['moroccan', 'pattern', 'bohemian']
  },
  {
    id: 'tile-herringbone',
    name: 'Gray Herringbone',
    category: 'faux-tile',
    imageUrl: 'https://images.unsplash.com/photo-1600566752734-2a0cd44bf2a6?w=800&q=80',
    description: 'Elegant herringbone pattern in gray tones',
    tags: ['elegant', 'pattern', 'sophisticated']
  },
  {
    id: 'tile-penny-round',
    name: 'Penny Round',
    category: 'faux-tile',
    imageUrl: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800&q=80',
    description: 'Retro penny round tile in mixed colors',
    tags: ['retro', 'bathroom', 'vintage']
  },

  // Abstract (5)
  {
    id: 'abstract-geometric',
    name: 'Bold Geometric',
    category: 'abstract',
    imageUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80',
    description: 'Bold geometric shapes in contrasting colors',
    tags: ['bold', 'modern', 'graphic']
  },
  {
    id: 'abstract-watercolor',
    name: 'Soft Watercolor Wash',
    category: 'abstract',
    imageUrl: 'https://images.unsplash.com/photo-1579547945413-497e1b99dac0?w=800&q=80',
    description: 'Soft watercolor gradient effect',
    tags: ['soft', 'artistic', 'calming']
  },
  {
    id: 'abstract-lines',
    name: 'Minimalist Lines',
    category: 'abstract',
    imageUrl: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80',
    description: 'Clean minimalist line art design',
    tags: ['minimal', 'clean', 'modern']
  },
  {
    id: 'abstract-colorblock',
    name: 'Color Block',
    category: 'abstract',
    imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
    description: 'Bold color blocking for statement walls',
    tags: ['bold', 'colorful', 'statement']
  },
  {
    id: 'abstract-brush-stroke',
    name: 'Brush Stroke',
    category: 'abstract',
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80',
    description: 'Artistic brush stroke abstract design',
    tags: ['artistic', 'dynamic', 'expressive']
  },

  // Giant Floral (4)
  {
    id: 'floral-giant-peony',
    name: 'Oversized Peony',
    category: 'giant-floral',
    imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80',
    description: 'Dramatic oversized peony blooms',
    tags: ['romantic', 'feminine', 'dramatic']
  },
  {
    id: 'floral-tropical-monstera',
    name: 'Tropical Monstera',
    category: 'giant-floral',
    imageUrl: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80',
    description: 'Large-scale tropical monstera leaves',
    tags: ['tropical', 'green', 'botanical']
  },
  {
    id: 'floral-statement-magnolia',
    name: 'Statement Magnolia',
    category: 'giant-floral',
    imageUrl: 'https://images.unsplash.com/photo-1518882605630-8b5fe33c0a91?w=800&q=80',
    description: 'Elegant oversized magnolia flowers',
    tags: ['elegant', 'southern', 'classic']
  },
  {
    id: 'floral-palm-paradise',
    name: 'Palm Paradise',
    category: 'giant-floral',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    description: 'Lush palm fronds for tropical vibes',
    tags: ['tropical', 'resort', 'vacation']
  },

  // Standard Floral (4)
  {
    id: 'floral-vintage-roses',
    name: 'Vintage Roses',
    category: 'standard-floral',
    imageUrl: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&q=80',
    description: 'Classic vintage rose pattern',
    tags: ['vintage', 'romantic', 'classic']
  },
  {
    id: 'floral-wildflower',
    name: 'Wildflower Meadow',
    category: 'standard-floral',
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
    description: 'Whimsical wildflower meadow design',
    tags: ['whimsical', 'natural', 'cheerful']
  },
  {
    id: 'floral-botanical-line',
    name: 'Botanical Line Art',
    category: 'standard-floral',
    imageUrl: 'https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?w=800&q=80',
    description: 'Delicate botanical line drawings',
    tags: ['minimal', 'artistic', 'elegant']
  },
  {
    id: 'floral-garden-trellis',
    name: 'Garden Trellis',
    category: 'standard-floral',
    imageUrl: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&q=80',
    description: 'Climbing vines on garden trellis pattern',
    tags: ['garden', 'traditional', 'green']
  },

  // Modern Kids Rooms (6)
  {
    id: 'kids-safari',
    name: 'Safari Animals',
    category: 'kids-rooms',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
    description: 'Friendly safari animals for nursery or kids room',
    tags: ['animals', 'nursery', 'playful']
  },
  {
    id: 'kids-space',
    name: 'Outer Space',
    category: 'kids-rooms',
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80',
    description: 'Rockets, planets, and stars for space explorers',
    tags: ['space', 'adventure', 'blue']
  },
  {
    id: 'kids-rainbow',
    name: 'Rainbow Dreams',
    category: 'kids-rooms',
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80',
    description: 'Colorful rainbow arches and clouds',
    tags: ['rainbow', 'cheerful', 'colorful']
  },
  {
    id: 'kids-dinosaurs',
    name: 'Friendly Dinosaurs',
    category: 'kids-rooms',
    imageUrl: 'https://images.unsplash.com/photo-1519066629447-267fffa62d4b?w=800&q=80',
    description: 'Cute cartoon dinosaurs in jungle setting',
    tags: ['dinosaurs', 'adventure', 'green']
  },
  {
    id: 'kids-world-map',
    name: 'World Map Adventure',
    category: 'kids-rooms',
    imageUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&q=80',
    description: 'Educational world map with animals',
    tags: ['educational', 'travel', 'colorful']
  },
  {
    id: 'kids-underwater',
    name: 'Underwater World',
    category: 'kids-rooms',
    imageUrl: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=800&q=80',
    description: 'Ocean creatures and coral reef scene',
    tags: ['ocean', 'blue', 'animals']
  },

  // Automotive (5)
  {
    id: 'auto-supercar-lineup',
    name: 'B&W Supercar Lineup',
    category: 'automotive',
    imageUrl: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
    description: 'Dramatic black and white supercar silhouettes',
    tags: ['cars', 'luxury', 'dramatic']
  },
  {
    id: 'auto-muscle-classic',
    name: 'Classic Muscle Silhouettes',
    category: 'automotive',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
    description: 'Iconic American muscle car outlines',
    tags: ['muscle', 'american', 'classic']
  },
  {
    id: 'auto-racing-stripes',
    name: 'Racing Stripes',
    category: 'automotive',
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80',
    description: 'Bold racing stripe patterns',
    tags: ['racing', 'bold', 'sport']
  },
  {
    id: 'auto-vintage-blueprints',
    name: 'Vintage Car Blueprints',
    category: 'automotive',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
    description: 'Technical blueprint drawings of classic cars',
    tags: ['blueprint', 'technical', 'vintage']
  },
  {
    id: 'auto-motorcycle',
    name: 'Motorcycle Gallery',
    category: 'automotive',
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80',
    description: 'Classic motorcycle collection artwork',
    tags: ['motorcycle', 'vintage', 'garage']
  },

  // Topography (4)
  {
    id: 'topo-mountain-contour',
    name: 'Mountain Contour',
    category: 'topography',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    description: 'Minimalist mountain contour lines',
    tags: ['mountains', 'minimal', 'outdoor']
  },
  {
    id: 'topo-city-grid',
    name: 'City Street Grid',
    category: 'topography',
    imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
    description: 'Urban city street map pattern',
    tags: ['urban', 'city', 'modern']
  },
  {
    id: 'topo-ocean-depth',
    name: 'Ocean Depth Chart',
    category: 'topography',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    description: 'Nautical ocean depth contour map',
    tags: ['ocean', 'nautical', 'blue']
  },
  {
    id: 'topo-desert-terrain',
    name: 'Desert Terrain',
    category: 'topography',
    imageUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80',
    description: 'Desert canyon topographic lines',
    tags: ['desert', 'warm', 'natural']
  },

  // AirBnB Collection (10)
  {
    id: 'airbnb-welcome-script',
    name: 'Welcome Script',
    category: 'airbnb',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    description: 'Elegant "Welcome" calligraphy design',
    tags: ['welcome', 'elegant', 'hospitality']
  },
  {
    id: 'airbnb-beach-waves',
    name: 'Beach Waves',
    category: 'airbnb',
    imageUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80',
    description: 'Serene ocean waves for coastal properties',
    tags: ['beach', 'coastal', 'relaxing']
  },
  {
    id: 'airbnb-mountain-silhouette',
    name: 'Mountain Silhouette',
    category: 'airbnb',
    imageUrl: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
    description: 'Mountain range silhouette at sunset',
    tags: ['mountains', 'scenic', 'adventure']
  },
  {
    id: 'airbnb-city-skyline',
    name: 'City Skyline',
    category: 'airbnb',
    imageUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80',
    description: 'Urban city skyline for downtown rentals',
    tags: ['city', 'urban', 'modern']
  },
  {
    id: 'airbnb-botanical-paradise',
    name: 'Botanical Paradise',
    category: 'airbnb',
    imageUrl: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=800&q=80',
    description: 'Lush tropical botanical garden',
    tags: ['tropical', 'green', 'paradise']
  },
  {
    id: 'airbnb-desert-sunset',
    name: 'Desert Sunset',
    category: 'airbnb',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
    description: 'Warm desert sunset with cacti silhouettes',
    tags: ['desert', 'sunset', 'southwest']
  },
  {
    id: 'airbnb-boho-geometric',
    name: 'Boho Geometric',
    category: 'airbnb',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
    description: 'Modern bohemian geometric pattern',
    tags: ['boho', 'geometric', 'trendy']
  },
  {
    id: 'airbnb-local-map',
    name: 'Local Map Art',
    category: 'airbnb',
    imageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80',
    description: 'Custom local area street map design',
    tags: ['map', 'local', 'custom']
  },
  {
    id: 'airbnb-forest-escape',
    name: 'Forest Escape',
    category: 'airbnb',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    description: 'Misty forest trees for cabin rentals',
    tags: ['forest', 'nature', 'peaceful']
  },
  {
    id: 'airbnb-vineyard-view',
    name: 'Vineyard View',
    category: 'airbnb',
    imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80',
    description: 'Rolling vineyard hills for wine country',
    tags: ['vineyard', 'wine', 'scenic']
  },
];

export const getDesignsByCategory = (categoryId: string): WallDesign[] => {
  if (categoryId === 'all') return wallDesigns;
  return wallDesigns.filter(design => design.category === categoryId);
};

export const getDesignById = (id: string): WallDesign | undefined => {
  return wallDesigns.find(design => design.id === id);
};
