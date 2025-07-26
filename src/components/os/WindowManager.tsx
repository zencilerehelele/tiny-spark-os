import { AppWindow } from "./AppWindow";

interface Window {
  id: string;
  app: string;
  title: string;
  isMinimized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface WindowManagerProps {
  windows: Window[];
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Window>) => void;
  currentBackground: string;
  onBackgroundChange: (background: string, type: 'image' | 'color' | 'gradient') => void;
}

export const WindowManager = ({ windows, onClose, onMinimize, onMaximize, onUpdate, currentBackground, onBackgroundChange }: WindowManagerProps) => {
  return (
    <>
      {windows.map(window => (
        !window.isMinimized && (
        <AppWindow
          key={window.id}
          window={window}
          onClose={() => onClose(window.id)}
          onMinimize={() => onMinimize(window.id)}
          onMaximize={() => onMaximize(window.id)}
          onUpdate={(updates) => onUpdate(window.id, updates)}
          currentBackground={currentBackground}
          onBackgroundChange={onBackgroundChange}
        />
        )
      ))}
    </>
  );
};