import React, { useState } from "react";
import wallpaper from "@/assets/linux-wallpaper.jpg";
import neonWallpaper from "@/assets/neon-city-wallpaper.jpg";
import { Taskbar } from "./Taskbar";
import { WindowManager } from "./WindowManager";
import { DesktopIcon } from "./DesktopIcon";
import { StartupScreen } from "./StartupScreen";
import { FolderOpen, Terminal, FileText, Calculator, Globe, Gamepad2, Settings, Youtube, Music, FileSpreadsheet, PenTool } from "lucide-react";

export const Desktop = () => {
  const [isStartup, setIsStartup] = useState(true);
  const [background, setBackground] = useState(wallpaper);
  const [backgroundType, setBackgroundType] = useState<'image' | 'color' | 'gradient'>('image');
  const [windows, setWindows] = useState<Array<{
    id: string;
    app: string;
    title: string;
    isMinimized: boolean;
    isMaximized: boolean;
    position: { x: number; y: number };
    size: { width: number; height: number };
  }>>([]);
  const [iconPositions, setIconPositions] = useState<{ [key: string]: { x: number; y: number } }>({});

  const openApp = (app: string, title: string) => {
    const newWindow = {
      id: Date.now().toString(),
      app,
      title,
      isMinimized: false,
      isMaximized: false,
      position: { x: 100 + windows.length * 50, y: 50 + windows.length * 30 },
      size: { width: 800, height: 600 }
    };
    setWindows(prev => [...prev, newWindow]);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: true } : w
    ));
  };

  const maximizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { 
        ...w, 
        isMaximized: !w.isMaximized,
        position: w.isMaximized ? w.position : { x: 0, y: 0 },
        size: w.isMaximized ? w.size : { width: window.innerWidth, height: window.innerHeight - 48 }
      } : w
    ));
  };

  const restoreWindow = (id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: false } : w
    ));
  };

  const updateWindow = (id: string, updates: Partial<typeof windows[0]>) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, ...updates } : w
    ));
  };

  const handleBackgroundChange = (newBackground: string, type: 'image' | 'color' | 'gradient') => {
    setBackground(newBackground);
    setBackgroundType(type);
  };

  const desktopIcons = [
    { name: "Files", icon: FolderOpen, app: "files" },
    { name: "Terminal", icon: Terminal, app: "terminal" },
    { name: "Text Editor", icon: FileText, app: "editor" },
    { name: "Word Processor", icon: PenTool, app: "word" },
    { name: "Spreadsheet", icon: FileSpreadsheet, app: "spreadsheet" },
    { name: "Calculator", icon: Calculator, app: "calculator" },
    { name: "Browser", icon: Globe, app: "browser" },
    { name: "YouTube", icon: Youtube, app: "youtube" },
    { name: "Music", icon: Music, app: "music" },
    { name: "Games", icon: Gamepad2, app: "games" },
    { name: "Settings", icon: Settings, app: "settings" }
  ];

  // Listen for terminal app open events
  React.useEffect(() => {
    const handleOpenApp = (event: CustomEvent) => {
      openApp(event.detail.app, event.detail.title);
    };
    
    window.addEventListener('openApp', handleOpenApp as EventListener);
    return () => window.removeEventListener('openApp', handleOpenApp as EventListener);
  }, []);

  const handleIconPositionChange = (iconName: string, position: { x: number; y: number }) => {
    setIconPositions(prev => ({
      ...prev,
      [iconName]: position
    }));
  };

  if (isStartup) {
    return <StartupScreen onStartupComplete={() => setIsStartup(false)} />;
  }

  return (
    <div 
      className="h-screen w-screen bg-desktop relative overflow-hidden"
      style={{
        background: backgroundType === 'image' 
          ? `url(${background})` 
          : background,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Desktop Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {desktopIcons.map((icon, index) => (
          <div key={icon.name} className="pointer-events-auto">
            <DesktopIcon
              name={icon.name}
              icon={icon.icon}
              onDoubleClick={() => openApp(icon.app, icon.name)}
              position={iconPositions[icon.name] || { 
                x: 20, 
                y: 20 + index * 100 
              }}
              onPositionChange={(position) => handleIconPositionChange(icon.name, position)}
            />
          </div>
        ))}
      </div>

      {/* Windows */}
      <WindowManager
        windows={windows}
        onClose={closeWindow}
        onMinimize={minimizeWindow}
        onMaximize={maximizeWindow}
        onUpdate={updateWindow}
        currentBackground={background}
        onBackgroundChange={handleBackgroundChange}
      />

      {/* Taskbar */}
      <Taskbar
        windows={windows}
        onAppClick={openApp}
        onWindowRestore={restoreWindow}
      />
    </div>
  );
};