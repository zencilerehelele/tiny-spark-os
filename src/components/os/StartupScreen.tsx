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
    <div className="h-screen w-screen bg-gradient-to-b from-purple-900 via-purple-800 to-orange-600 flex items-center justify-center relative overflow-hidden">
      {/* Ubuntu-style background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-orange-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-purple-300 rounded-full blur-2xl"></div>
      </div>
      
      <div className="text-center space-y-8 z-10">
        <div className="space-y-4">
          {/* Ubuntu-style logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center relative">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full"></div>
              </div>
              <div className="absolute top-2 right-2 w-4 h-4 bg-orange-300 rounded-full"></div>
              <div className="absolute bottom-2 left-2 w-3 h-3 bg-red-400 rounded-full"></div>
            </div>
          </div>
          <h1 className="text-5xl font-light text-white">TinySpark Midnight</h1>
          <p className="text-xl text-white/80 font-light">Version 2.0.0 - Enhanced Experience</p>
        </div>
        
        <div className="space-y-6 w-96">
          <div className="flex items-center gap-3 text-white">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="font-light text-lg">{currentMessage}</span>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-1">
            <div 
              className="bg-gradient-to-r from-orange-400 to-red-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="text-lg text-white/70 font-light">
            {progress}% Complete
          </div>
        </div>
      </div>
    </div>
  );
};