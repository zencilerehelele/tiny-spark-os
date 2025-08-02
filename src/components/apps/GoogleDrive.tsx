import React, { useState } from "react";
import { FolderOpen, FileVideo, Play, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const GoogleDrive = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // Sample video files from Google Drive folder
  const videos = [
    {
      id: "1",
      name: "Sample Video 1.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=200&fit=crop",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    },
    {
      id: "2", 
      name: "Sample Video 2.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=200&fit=crop",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
    },
    {
      id: "3",
      name: "Sample Video 3.mp4", 
      thumbnailUrl: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=300&h=200&fit=crop",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
    }
  ];

  const filteredVideos = videos.filter(video =>
    video.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const playVideo = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
  };

  return (
    <div className="h-full bg-background text-foreground flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-muted border-b border-border">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-os-primary" />
          <span className="font-semibold">Google Drive Videos</span>
        </div>
        <Input
          placeholder="Search videos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64"
        />
      </div>

      <div className="flex-1 flex">
        {/* Video List */}
        <div className="w-80 border-r border-border overflow-y-auto">
          <div className="p-4 space-y-3">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => playVideo(video.videoUrl)}
              >
                <div className="relative">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.name}
                    className="w-16 h-12 object-cover rounded"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-6 h-6 text-white bg-black/50 rounded-full p-1" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{video.name}</p>
                  <p className="text-xs text-muted-foreground">Video file</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Player */}
        <div className="flex-1 flex flex-col">
          {selectedVideo ? (
            <div className="flex-1 bg-black flex items-center justify-center">
              <video
                src={selectedVideo}
                controls
                className="max-w-full max-h-full"
                autoPlay
              >
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-muted/20">
              <div className="text-center">
                <FileVideo className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  Select a video to play
                </p>
                <p className="text-sm text-muted-foreground">
                  Choose from the videos in your Google Drive folder
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoogleDrive;