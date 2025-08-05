import React, { useState } from "react";
import { Menu, Terminal, FolderOpen, FileText, Calculator, Clock, Globe, Gamepad2, Settings, Youtube, Music, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TaskbarProps {
  windows: Array<{
    id: string;
    app: string;
    title: string;
    isMinimized: boolean;
  }>;
  onAppClick: (app: string, title: string) => void;
  onWindowRestore: (id: string) => void;
}

export const Taskbar = ({ windows, onAppClick, onWindowRestore }: TaskbarProps) => {
  const [showAppMenu, setShowAppMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [batteryLevel, setBatteryLevel] = useState(85);

  // Update time every second and simulate battery drain
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Simulate slow battery drain
      setBatteryLevel(prev => prev > 0 ? Math.max(0, prev - 0.01) : 85);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const appMenuItems = [
    { name: "Terminal", icon: Terminal, app: "kali-terminal" },
    { name: "Files", icon: FolderOpen, app: "filesystem" },
    { name: "Text Editor", icon: FileText, app: "editor" },
    { name: "Calculator", icon: Calculator, app: "calculator" },
    { name: "Firefox", icon: Globe, app: "firefox" },
    { name: "YouTube", icon: Youtube, app: "youtube" },
    { name: "Spotify", icon: Music, app: "spotify" },
    { name: "Hotline Spark", icon: Gamepad2, app: "hotline-miami" },
    { name: "LibreOffice Writer", icon: FileText, app: "libreoffice-writer" },
    { name: "LibreOffice Calc", icon: FileText, app: "libreoffice-calc" },
    { name: "Programming IDE", icon: FileText, app: "programming" },
    { name: "Task Manager", icon: Settings, app: "task-manager" },
    { name: "Google Drive", icon: FolderOpen, app: "google-drive" },
    { name: "Bazaar", icon: Settings, app: "bazaar" },
    { name: "Tupack", icon: Settings, app: "tupack" },
    { name: "Settings", icon: Settings, app: "settings" }
  ];

  const filteredApps = appMenuItems.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-800/90 backdrop-blur-xl border-t border-gray-600/30 flex items-center justify-center px-4 z-50 shadow-2xl">
      {/* Dock Container */}
      <div className="flex items-center justify-center bg-gray-700/50 backdrop-blur-lg rounded-2xl px-4 py-2 border border-gray-600/30">
        {/* App Icons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-12 w-12 rounded-xl text-white hover:bg-white/10 transition-all duration-200 hover:scale-110"
            onClick={() => setShowAppMenu(!showAppMenu)}
          >
            <div className="flex items-center justify-center w-8 h-8">
              <img src="/src/assets/spark-logo.png" alt="Spark" className="w-8 h-8 rounded-lg" />
            </div>
          </Button>
        
          {/* Quick App Icons */}
          {[
            { name: "Terminal", icon: Terminal, app: "kali-terminal" },
            { name: "Files", icon: FolderOpen, app: "filesystem" },
            { name: "Firefox", icon: Globe, app: "firefox" },
            { name: "Calculator", icon: Calculator, app: "calculator" },
            { name: "Text Editor", icon: FileText, app: "editor" },
            { name: "Games", icon: Gamepad2, app: "game-library" }
          ].map(item => (
            <Button
              key={item.name}
              variant="ghost"
              size="sm"
              className="h-12 w-12 rounded-xl text-white hover:bg-white/10 transition-all duration-200 hover:scale-110 group relative"
              onClick={() => onAppClick(item.app, item.name)}
            >
              <item.icon className="w-6 h-6" />
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {item.name}
              </div>
            </Button>
          ))}
        </div>

        {showAppMenu && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 bg-gray-800/95 backdrop-blur-lg border border-gray-600/50 rounded-2xl shadow-2xl p-4 min-w-80 max-h-96 overflow-y-auto">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-white">Applications</span>
              </div>
              <Input
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-700/50 border-gray-600 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {filteredApps.map(item => (
                <button
                  key={item.name}
                  className="flex items-center gap-3 px-3 py-3 text-white hover:bg-gray-700/50 transition-all duration-200 rounded-lg text-left"
                  onClick={() => {
                    onAppClick(item.app, item.name);
                    setShowAppMenu(false);
                    setSearchQuery("");
                  }}
                >
                  <div className="flex-shrink-0">
                    <item.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-sm truncate">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Time and Battery Display */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-3">
        <div className="flex items-center gap-2 text-white text-sm">
          <div className="flex items-center gap-1">
            <div className={`w-6 h-3 border border-white/50 rounded-sm relative ${batteryLevel < 20 ? 'bg-red-500' : batteryLevel < 50 ? 'bg-yellow-500' : 'bg-green-500'}`}>
              <div 
                className="h-full bg-current rounded-sm transition-all duration-1000"
                style={{ width: `${batteryLevel}%` }}
              />
              <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-1.5 bg-white/50 rounded-r-sm" />
            </div>
            <span className="text-xs">{Math.round(batteryLevel)}%</span>
          </div>
        </div>
        <div className="text-white text-sm font-medium">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};