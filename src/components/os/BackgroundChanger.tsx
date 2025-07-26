import { useState } from "react";
import { Monitor, Image, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import wallpaper from "@/assets/linux-wallpaper.jpg";
import neonWallpaper from "@/assets/neon-city-wallpaper.jpg";
import mountainWallpaper from "@/assets/mountain-wallpaper.jpg";

interface BackgroundChangerProps {
  currentBackground: string;
  onBackgroundChange: (background: string, type: 'image' | 'color' | 'gradient') => void;
}

export const BackgroundChanger = ({ currentBackground, onBackgroundChange }: BackgroundChangerProps) => {
  const predefinedWallpapers = [
    { name: "Default Linux", url: wallpaper },
    { name: "Neon City", url: neonWallpaper },
    { name: "Mountain Vista", url: mountainWallpaper },
    { name: "Mountain Sunset", url: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    { name: "Ocean Blue", url: "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)" },
    { name: "Forest Green", url: "linear-gradient(135deg, #55a3ff 0%, #003d82 100%)" }
  ];

  const solidColors = [
    "#1a1a1a", "#2d3748", "#1a202c", "#2a4365", 
    "#553c9a", "#6b46c1", "#7c2d12", "#92400e"
  ];

  const gradients = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
  ];

  return (
    <div className="h-full p-6 bg-window">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-window-foreground">Personalize Your Desktop</h2>
        <p className="text-muted-foreground">Change your desktop background</p>
      </div>

      <Tabs defaultValue="wallpapers" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="wallpapers" className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            Wallpapers
          </TabsTrigger>
          <TabsTrigger value="colors" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="gradients" className="flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            Gradients
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wallpapers" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {predefinedWallpapers.map((wallpaper, index) => (
              <div
                key={index}
                className="relative aspect-video border border-border rounded-lg overflow-hidden cursor-pointer hover:border-os-primary transition-colors"
                onClick={() => onBackgroundChange(wallpaper.url, wallpaper.url.startsWith('linear-gradient') ? 'gradient' : 'image')}
              >
                <div
                  className="w-full h-full"
                  style={{
                    background: wallpaper.url.startsWith('linear-gradient') 
                      ? wallpaper.url 
                      : `url(${wallpaper.url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
                  <p className="text-xs font-medium">{wallpaper.name}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="colors" className="mt-6">
          <div className="grid grid-cols-6 md:grid-cols-8 gap-3">
            {solidColors.map((color, index) => (
              <button
                key={index}
                className="aspect-square rounded-lg border-2 border-border hover:border-os-primary transition-colors"
                style={{ backgroundColor: color }}
                onClick={() => onBackgroundChange(color, 'color')}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="gradients" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gradients.map((gradient, index) => (
              <button
                key={index}
                className="aspect-video rounded-lg border-2 border-border hover:border-os-primary transition-colors"
                style={{ background: gradient }}
                onClick={() => onBackgroundChange(gradient, 'gradient')}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8 p-4 border border-border rounded-lg">
        <h3 className="font-semibold text-window-foreground mb-2">Current Background</h3>
        <div className="flex items-center gap-4">
          <div
            className="w-20 h-12 border border-border rounded"
            style={{
              background: currentBackground.startsWith('#') || currentBackground.startsWith('linear-gradient')
                ? currentBackground
                : `url(${currentBackground})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBackgroundChange(wallpaper, 'image')}
          >
            Reset to Default
          </Button>
        </div>
      </div>
    </div>
  );
};