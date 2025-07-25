import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface StartupScreenProps {
  onStartupComplete: () => void;
}

export const StartupScreen = ({ onStartupComplete }: StartupScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("Initializing TinySpark Midnight...");

  const messages = [
    "Initializing TinySpark Midnight...",
    "Loading kernel modules...",
    "Starting system services...",
    "Mounting filesystems...",
    "Loading new apps (YouTube, Music Player)...",
    "Initializing draggable interface...",
    "Loading desktop environment...",
    "Ready!"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        const messageIndex = Math.floor((newProgress / 100) * messages.length);
        if (messageIndex < messages.length) {
          setCurrentMessage(messages[messageIndex]);
        }
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(onStartupComplete, 500);
        }
        
        return Math.min(newProgress, 100);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onStartupComplete]);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-terminal-bg to-panel flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-os-primary">TinySpark Midnight</h1>
          <p className="text-xl text-muted-foreground">Version 2.0.0 - Enhanced Experience</p>
        </div>
        
        <div className="space-y-4 w-80">
          <div className="flex items-center gap-3 text-terminal-text">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="font-mono text-sm">{currentMessage}</span>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-os-primary h-2 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="text-sm text-muted-foreground font-mono">
            {progress}% Complete
          </div>
        </div>
      </div>
    </div>
  );
};