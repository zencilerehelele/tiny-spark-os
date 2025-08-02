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

  // Update time every second
  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
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
    { name: "Settings", icon: Settings, app: "settings" }
  ];

  const filteredApps = appMenuItems.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-r from-panel to-panel/90 backdrop-blur-md border-t border-border/50 flex items-center px-3 z-50 shadow-lg">
      {/* App Menu Button */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 rounded-full text-panel-foreground hover:bg-os-primary/20 transition-all duration-200"
          onClick={() => setShowAppMenu(!showAppMenu)}
        >
          <div className="flex items-center justify-center w-6 h-6">
            <img src="/src/assets/spark-logo.png" alt="Spark" className="w-6 h-6" />
          </div>
        </Button>
        
        {showAppMenu && (
          <div className="absolute bottom-full left-0 mb-3 bg-window/95 backdrop-blur-lg border border-border/50 rounded-lg shadow-2xl p-4 min-w-80 max-h-96 overflow-y-auto">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-window-foreground">Applications</span>
              </div>
              <Input
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {filteredApps.map(item => (
                <button
                  key={item.name}
                  className="flex items-center gap-3 px-3 py-3 text-window-foreground hover:bg-os-primary/20 transition-all duration-200 rounded-lg text-left"
                  onClick={() => {
                    onAppClick(item.app, item.name);
                    setShowAppMenu(false);
                    setSearchQuery("");
                  }}
                >
                  <div className="flex-shrink-0">
                    <item.icon className="w-5 h-5 text-os-primary" />
                  </div>
                  <span className="text-sm truncate">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Window Buttons */}
      <div className="flex-1 flex items-center gap-2 px-4">
        {windows.map(window => (
          <Button
            key={window.id}
            variant="ghost"
            size="sm"
            className={`
              h-9 px-4 text-sm max-w-48 truncate rounded-lg transition-all duration-200
              ${window.isMinimized 
                ? 'text-muted-foreground bg-muted/30 hover:bg-muted/50' 
                : 'text-panel-foreground bg-os-primary/15 hover:bg-os-primary/25 border border-os-primary/20'
              }
            `}
            onClick={() => onWindowRestore(window.id)}
          >
            {window.title}
          </Button>
        ))}
      </div>

      {/* System Tray */}
      <div className="flex items-center gap-3 text-panel-foreground">
        <div className="flex items-center gap-2 bg-background/20 rounded-lg px-3 py-2">
          <Clock className="w-4 h-4 text-os-primary" />
          <div className="flex flex-col">
            <span className="font-mono text-sm font-medium">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {currentTime.toLocaleDateString([], { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};