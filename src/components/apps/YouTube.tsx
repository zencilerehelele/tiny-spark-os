import React, { useState } from "react";
import { Search, Play, Pause, Volume2, Maximize2, Heart, Share2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const YouTube = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const videos = [
    {
      id: 1,
      title: "Ambient Space Music - Deep Focus",
      channel: "SpaceVibes",
      views: "2.1M views",
      duration: "3:24:15",
      thumbnail: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=320&h=180&fit=crop&crop=center",
      description: "Perfect ambient music for deep work and focus sessions."
    },
    {
      id: 2,
      title: "Coding Music - Lo-Fi Hip Hop",
      channel: "CodeBeats",
      views: "890K views",
      duration: "1:45:32",
      thumbnail: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=320&h=180&fit=crop&crop=center",
      description: "Chill lo-fi beats perfect for programming sessions."
    },
    {
      id: 3,
      title: "Nature Sounds - Forest Rain",
      channel: "NatureSounds",
      views: "3.5M views",
      duration: "2:15:45",
      thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=320&h=180&fit=crop&crop=center",
      description: "Relaxing forest rain sounds for meditation and sleep."
    },
    {
      id: 4,
      title: "Synthwave Retrowave Mix",
      channel: "RetroVibes",
      views: "1.2M views",
      duration: "1:32:18",
      thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=320&h=180&fit=crop&crop=center",
      description: "Best synthwave and retrowave tracks compilation."
    }
  ];

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.channel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-border">
        <div className="text-xl font-bold text-destructive">TubeSpark</div>
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Input
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-12"
            />
            <Button
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100%-64px)]">
        {/* Video Player */}
        {selectedVideo && (
          <div className="flex-1 p-4">
            <div className="aspect-video bg-muted rounded-lg mb-4 relative overflow-hidden">
              <img 
                src={selectedVideo.thumbnail} 
                alt={selectedVideo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Button
                  size="lg"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-full"
                >
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                </Button>
              </div>
              <div className="absolute bottom-4 right-4 bg-black/80 text-white px-2 py-1 rounded text-sm">
                {selectedVideo.duration}
              </div>
            </div>
            
            <h1 className="text-xl font-semibold mb-2">{selectedVideo.title}</h1>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-medium">{selectedVideo.channel}</div>
                <div className="text-sm text-muted-foreground">{selectedVideo.views}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Heart className="w-4 h-4 mr-2" />
                  Like
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
            <p className="text-muted-foreground">{selectedVideo.description}</p>
          </div>
        )}

        {/* Video List */}
        <div className={`${selectedVideo ? 'w-96' : 'flex-1'} border-l border-border overflow-y-auto`}>
          <div className="p-4">
            <h3 className="font-semibold mb-4">
              {searchQuery ? `Search results for "${searchQuery}"` : "Recommended"}
            </h3>
            <div className="space-y-3">
              {filteredVideos.map(video => (
                <div
                  key={video.id}
                  className="flex gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-32 h-18 object-cover rounded"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/80 text-white px-1 py-0.5 rounded text-xs">
                      {video.duration}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium line-clamp-2 mb-1">{video.title}</h4>
                    <p className="text-sm text-muted-foreground">{video.channel}</p>
                    <p className="text-sm text-muted-foreground">{video.views}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTube;