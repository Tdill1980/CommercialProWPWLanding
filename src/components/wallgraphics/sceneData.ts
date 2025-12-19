export interface RoomScene {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  wallZone: {
    top: string;
    left: string;
    width: string;
    height: string;
  };
  description: string;
}

export const roomScenes: RoomScene[] = [
  {
    id: 'modern-living',
    name: 'Modern Living Room',
    category: 'residential',
    imageUrl: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1200&q=80',
    wallZone: { top: '10%', left: '15%', width: '70%', height: '55%' },
    description: 'Contemporary living space with neutral furniture'
  },
  {
    id: 'cozy-bedroom',
    name: 'Cozy Bedroom',
    category: 'residential',
    imageUrl: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=80',
    wallZone: { top: '5%', left: '20%', width: '60%', height: '50%' },
    description: 'Comfortable bedroom with headboard wall'
  },
  {
    id: 'kids-bedroom',
    name: 'Kids Bedroom',
    category: 'residential',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80',
    wallZone: { top: '8%', left: '10%', width: '80%', height: '45%' },
    description: 'Playful kids room with bed and desk'
  },
  {
    id: 'home-office',
    name: 'Home Office',
    category: 'residential',
    imageUrl: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=80',
    wallZone: { top: '10%', left: '25%', width: '50%', height: '55%' },
    description: 'Professional home office space'
  },
  {
    id: 'kitchen-dining',
    name: 'Kitchen & Dining',
    category: 'residential',
    imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80',
    wallZone: { top: '5%', left: '30%', width: '40%', height: '50%' },
    description: 'Open kitchen with dining area'
  },
  {
    id: 'airbnb-living',
    name: 'AirBnB Living Room',
    category: 'airbnb',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
    wallZone: { top: '8%', left: '20%', width: '60%', height: '50%' },
    description: 'Stylish vacation rental living space'
  },
  {
    id: 'airbnb-bedroom',
    name: 'AirBnB Bedroom',
    category: 'airbnb',
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
    wallZone: { top: '5%', left: '15%', width: '70%', height: '55%' },
    description: 'Inviting guest bedroom for rentals'
  },
  {
    id: 'gym-commercial',
    name: 'Commercial Gym',
    category: 'commercial',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80',
    wallZone: { top: '10%', left: '10%', width: '80%', height: '60%' },
    description: 'Fitness center with open wall space'
  },
  {
    id: 'restaurant-cafe',
    name: 'Restaurant & Cafe',
    category: 'commercial',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80',
    wallZone: { top: '5%', left: '25%', width: '50%', height: '45%' },
    description: 'Dining establishment with accent wall'
  },
  {
    id: 'retail-showroom',
    name: 'Retail Showroom',
    category: 'commercial',
    imageUrl: 'https://images.unsplash.com/photo-1604176424472-9cb07c6d1b4d?w=1200&q=80',
    wallZone: { top: '8%', left: '15%', width: '70%', height: '55%' },
    description: 'Retail space with feature wall'
  },
];

export const sceneCategories = [
  { id: 'all', name: 'All Rooms' },
  { id: 'residential', name: 'Residential' },
  { id: 'airbnb', name: 'AirBnB' },
  { id: 'commercial', name: 'Commercial' },
];

export const getScenesByCategory = (categoryId: string): RoomScene[] => {
  if (categoryId === 'all') return roomScenes;
  return roomScenes.filter(scene => scene.category === categoryId);
};
