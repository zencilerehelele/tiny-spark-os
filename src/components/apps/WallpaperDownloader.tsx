import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Download, Search, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface Wallpaper {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  category: string;
}

interface WallpaperDownloaderProps {
  currentBackground?: string;
  onBackgroundChange?: (background: string, type: 'image' | 'color' | 'gradient') => void;
}

export const WallpaperDownloader = ({ currentBackground, onBackgroundChange }: WallpaperDownloaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Sample wallpapers for demo
  const sampleWallpapers: Wallpaper[] = [
    {
      id: "1",
      title: "Mountain Landscape",
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
      category: "Nature"
    },
    {
      id: "2", 
      title: "Ocean Waves",
      url: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&h=1080&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=300&h=200&fit=crop",
      category: "Nature"
    },
    {
      id: "3",
      title: "City Skyline",
      url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&h=1080&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop",
      category: "Urban"
    },
    {
      id: "4",
      title: "Space Nebula",
      url: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1920&h=1080&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=200&fit=crop",
      category: "Space"
    },
    {
      id: "5",
      title: "Forest Path",
      url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop",
      category: "Nature"
    },
    {
      id: "6",
      title: "Abstract Art",
      url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1920&h=1080&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=300&h=200&fit=crop",
      category: "Abstract"
    }
  ];

  const handleSearch = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (searchQuery.trim()) {
      const filtered = sampleWallpapers.filter(w => 
        w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setWallpapers(filtered);
    } else {
      setWallpapers(sampleWallpapers);
    }
    
    setIsLoading(false);
    toast(`Found ${wallpapers.length} wallpapers`);
  };

  const handleDownload = async (wallpaper: Wallpaper) => {
    try {
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = wallpaper.url;
      link.download = `${wallpaper.title.replace(/\s+/g, '_')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast(`Downloading ${wallpaper.title}...`);
    } catch (error) {
      toast("Download failed", { description: "Please try again" });
    }
  };

  const handleSetAsWallpaper = (wallpaper: Wallpaper) => {
    // Dispatch event to change desktop background
    window.dispatchEvent(new CustomEvent('changeBackground', {
      detail: { background: wallpaper.url, type: 'image' }
    }));
    toast(`Set ${wallpaper.title} as wallpaper!`);
  };

  // Load sample wallpapers on mount
  React.useEffect(() => {
    setWallpapers(sampleWallpapers);
  }, []);

  return (
    <div className="h-full flex flex-col bg-window">
      {/* Header */}
      <div className="border-b border-border p-4">
        <h1 className="text-xl font-semibold text-window-foreground mb-4">Wallpaper Downloader</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search wallpapers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={isLoading}>
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
              <p className="text-muted-foreground">Searching wallpapers...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wallpapers.map(wallpaper => (
              <Card key={wallpaper.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={wallpaper.thumbnail}
                    alt={wallpaper.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleSetAsWallpaper(wallpaper)}
                      className="bg-primary/80 hover:bg-primary"
                    >
                      Set as Wallpaper
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleDownload(wallpaper)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-window-foreground">{wallpaper.title}</h3>
                  <p className="text-sm text-muted-foreground">{wallpaper.category}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
        
        {!isLoading && wallpapers.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No wallpapers found. Try a different search term.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};