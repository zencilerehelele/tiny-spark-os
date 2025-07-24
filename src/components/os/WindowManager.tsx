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
  onUpdate: (id: string, updates: Partial<Window>) => void;
}

export const WindowManager = ({ windows, onClose, onMinimize, onUpdate }: WindowManagerProps) => {
  return (
    <>
      {windows.map(window => (
        !window.isMinimized && (
          <AppWindow
            key={window.id}
            window={window}
            onClose={() => onClose(window.id)}
            onMinimize={() => onMinimize(window.id)}
            onUpdate={(updates) => onUpdate(window.id, updates)}
          />
        )
      ))}
    </>
  );
};