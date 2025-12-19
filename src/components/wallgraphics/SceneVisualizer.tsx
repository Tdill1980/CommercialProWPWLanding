import { useState } from 'react';
import { roomScenes, sceneCategories, getScenesByCategory, RoomScene } from './sceneData';
import { WallDesign } from './designData';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface SceneVisualizerProps {
  selectedDesign: WallDesign | null;
  onSelectWall: () => void;
}

const SceneVisualizer = ({ selectedDesign, onSelectWall }: SceneVisualizerProps) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  
  const scenes = getScenesByCategory(selectedCategory);
  const currentScene = scenes[currentSceneIndex] || roomScenes[0];

  const handlePrevScene = () => {
    setCurrentSceneIndex((prev) => (prev === 0 ? scenes.length - 1 : prev - 1));
  };

  const handleNextScene = () => {
    setCurrentSceneIndex((prev) => (prev === scenes.length - 1 ? 0 : prev + 1));
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentSceneIndex(0);
  };

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      {/* Category Tabs */}
      <div className="flex gap-2 p-4 border-b border-border bg-muted/30 overflow-x-auto">
        {sceneCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === category.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-background hover:bg-muted text-muted-foreground'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Scene Display */}
      <div className="relative aspect-[16/10] bg-muted">
        {/* Room Image */}
        <img
          src={currentScene.imageUrl}
          alt={currentScene.name}
          className="w-full h-full object-cover"
        />

        {/* Wall Overlay Zone - Clickable */}
        <div
          onClick={onSelectWall}
          className="absolute cursor-pointer group transition-all duration-300 hover:ring-4 hover:ring-primary/50"
          style={{
            top: currentScene.wallZone.top,
            left: currentScene.wallZone.left,
            width: currentScene.wallZone.width,
            height: currentScene.wallZone.height,
          }}
        >
          {selectedDesign ? (
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${selectedDesign.imageUrl})`,
                mixBlendMode: 'multiply',
                opacity: 0.85
              }}
            />
          ) : (
            <div className="w-full h-full bg-primary/10 backdrop-blur-sm flex items-center justify-center border-2 border-dashed border-primary/40 group-hover:bg-primary/20 transition-all">
              <div className="text-center p-4">
                <Maximize2 className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium text-primary">Click to Select Design</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrevScene}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-background transition-all"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={handleNextScene}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-background transition-all"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Scene Info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white font-semibold">{currentScene.name}</h3>
          <p className="text-white/70 text-sm">{currentScene.description}</p>
        </div>
      </div>

      {/* Scene Thumbnails */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {scenes.map((scene, index) => (
            <button
              key={scene.id}
              onClick={() => setCurrentSceneIndex(index)}
              className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentSceneIndex
                  ? 'border-primary ring-2 ring-primary/30'
                  : 'border-transparent hover:border-muted-foreground/30'
              }`}
            >
              <img
                src={scene.imageUrl}
                alt={scene.name}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SceneVisualizer;
