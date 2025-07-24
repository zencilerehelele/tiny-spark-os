import React, { useState } from "react";
import { Menu, Terminal, FolderOpen, FileText, Calculator, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  // Update time every second
  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const appMenuItems = [
    { name: "Terminal", icon: Terminal, app: "terminal" },
    { name: "Files", icon: FolderOpen, app: "files" },
    { name: "Text Editor", icon: FileText, app: "editor" },
    { name: "Calculator", icon: Calculator, app: "calculator" }
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-panel border-t border-border flex items-center px-2 z-50">
      {/* App Menu Button */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-panel-foreground hover:bg-os-primary/20"
          onClick={() => setShowAppMenu(!showAppMenu)}
        >
          <Menu className="w-4 h-4" />
        </Button>
        
        {showAppMenu && (
          <div className="absolute bottom-full left-0 mb-2 bg-window border border-border rounded-md shadow-lg py-2 min-w-48">
            {appMenuItems.map(item => (
              <button
                key={item.name}
                className="w-full flex items-center gap-3 px-4 py-2 text-window-foreground hover:bg-os-primary/20 transition-colors"
                onClick={() => {
                  onAppClick(item.app, item.name);
                  setShowAppMenu(false);
                }}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Window Buttons */}
      <div className="flex-1 flex items-center gap-1 px-2">
        {windows.map(window => (
          <Button
            key={window.id}
            variant="ghost"
            size="sm"
            className={`
              h-8 px-3 text-xs max-w-40 truncate
              ${window.isMinimized 
                ? 'text-muted-foreground bg-muted/50' 
                : 'text-panel-foreground bg-os-primary/20'
              }
            `}
            onClick={() => onWindowRestore(window.id)}
          >
            {window.title}
          </Button>
        ))}
      </div>

      {/* System Tray */}
      <div className="flex items-center gap-2 text-panel-foreground text-sm">
        <Clock className="w-4 h-4" />
        <span className="font-mono">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};