import { useState } from "react";
import wallpaper from "@/assets/linux-wallpaper.jpg";
import { Taskbar } from "./Taskbar";
import { WindowManager } from "./WindowManager";
import { DesktopIcon } from "./DesktopIcon";
import { FolderOpen, Terminal, FileText, Calculator } from "lucide-react";

export const Desktop = () => {
  const [windows, setWindows] = useState<Array<{
    id: string;
    app: string;
    title: string;
    isMinimized: boolean;
    position: { x: number; y: number };
    size: { width: number; height: number };
  }>>([]);

  const openApp = (app: string, title: string) => {
    const newWindow = {
      id: Date.now().toString(),
      app,
      title,
      isMinimized: false,
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

  const desktopIcons = [
    { name: "Files", icon: FolderOpen, app: "files" },
    { name: "Terminal", icon: Terminal, app: "terminal" },
    { name: "Text Editor", icon: FileText, app: "editor" },
    { name: "Calculator", icon: Calculator, app: "calculator" }
  ];

  return (
    <div 
      className="h-screen w-screen bg-desktop relative overflow-hidden"
      style={{
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Desktop Icons */}
      <div className="absolute top-4 left-4 grid gap-4">
        {desktopIcons.map((icon, index) => (
          <DesktopIcon
            key={icon.name}
            name={icon.name}
            icon={icon.icon}
            onDoubleClick={() => openApp(icon.app, icon.name)}
          />
        ))}
      </div>

      {/* Windows */}
      <WindowManager
        windows={windows}
        onClose={closeWindow}
        onMinimize={minimizeWindow}
        onUpdate={updateWindow}
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