import React, { useState, useRef } from "react";
import { X, Minus, Square, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Terminal } from "../apps/Terminal";
import { FileManager } from "../apps/FileManager";
import { TextEditor } from "../apps/TextEditor";
import { Calculator } from "../apps/Calculator";
import Browser from "../apps/Browser";
import { GameLibrary } from "../apps/GameLibrary";
import { BackgroundChanger } from "./BackgroundChanger";
import YouTube from "../apps/YouTube";
import MusicPlayer from "../apps/MusicPlayer";
import { WordProcessor } from "../apps/WordProcessor";
import { Spreadsheet } from "../apps/Spreadsheet";
import { DrawingApp } from "../apps/DrawingApp";
import { WallpaperDownloader } from "../apps/WallpaperDownloader";
import { Firefox } from "../apps/Firefox";
import { MinecraftPI } from "../apps/MinecraftPI";
import TaskManager from "../apps/TaskManager";
import LibreOfficeWriter from "../apps/LibreOfficeWriter";
import LibreOfficeCalc from "../apps/LibreOfficeCalc";
import SpotifyApp from "../apps/SpotifyApp";
import KaliTerminal from "../apps/KaliTerminal";
import FileSystem from "../apps/FileSystem";
import ProgrammingApp from "../apps/ProgrammingApp";
import GoogleDrive from "../apps/GoogleDrive";
import { SnakeGame } from "../apps/SnakeGame";
import DoomClone from "../apps/DoomClone";
import Bazaar from "../apps/Bazaar";
import Tupack from "../apps/Tupack";

interface Window {
  id: string;
  app: string;
  title: string;
  isMinimized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface AppWindowProps {
  window: Window;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onUpdate: (updates: Partial<Window>) => void;
  currentBackground: string;
  onBackgroundChange: (background: string, type: 'image' | 'color' | 'gradient') => void;
}

export const AppWindow = ({ window, onClose, onMinimize, onMaximize, onUpdate, currentBackground, onBackgroundChange }: AppWindowProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - window.position.x,
      y: e.clientY - window.position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      onUpdate({
        position: {
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        }
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  const renderAppContent = () => {
    switch (window.app) {
      case 'terminal':
        return <Terminal />;
      case 'kali-terminal':
        return <KaliTerminal />;
      case 'files':
        return <FileManager />;
      case 'filesystem':
        return <FileSystem />;
      case 'editor':
        return <TextEditor />;
      case 'calculator':
        return <Calculator />;
      case 'browser':
        return <Browser />;
      case 'firefox':
        return <Firefox />;
      case 'youtube':
        return <YouTube />;
      case 'music':
        return <MusicPlayer />;
      case 'spotify':
        return <SpotifyApp />;
      case 'games':
        return <GameLibrary />;
      case 'minecraft':
        return <MinecraftPI />;
      case 'snake':
        return <SnakeGame onClose={() => {}} />;
      case 'word':
        return <WordProcessor />;
      case 'libreoffice-writer':
        return <LibreOfficeWriter />;
      case 'spreadsheet':
        return <Spreadsheet />;
      case 'libreoffice-calc':
        return <LibreOfficeCalc />;
      case 'programming':
        return <ProgrammingApp />;
      case 'task-manager':
        return <TaskManager />;
      case 'google-drive':
        return <GoogleDrive />;
      case 'draw':
        return <DrawingApp />;
      case 'doom':
        return <DoomClone />;
      case 'wallpaper':
        return <WallpaperDownloader currentBackground={currentBackground} onBackgroundChange={onBackgroundChange} />;
      case 'settings':
        return <BackgroundChanger currentBackground={currentBackground} onBackgroundChange={onBackgroundChange} />;
      case 'tupack':
        return <Tupack />;
      case 'bazaar':
        return <Bazaar />;
      default:
        return <div className="p-4 text-window-foreground">App not found</div>;
    }
  };

  return (
    <div
      ref={windowRef}
      className="absolute bg-window border border-border rounded-lg shadow-2xl overflow-hidden z-10"
      style={{
        left: window.position.x,
        top: window.position.y,
        width: window.size.width,
        height: window.size.height
      }}
    >
      {/* Title bar */}
      <div
        className="h-8 bg-panel border-b border-border flex items-center justify-between px-3 cursor-move"
        onMouseDown={handleMouseDown}
      >
        <span className="text-sm text-panel-foreground font-medium truncate">
          {window.title}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 hover:bg-yellow-500/20"
            onClick={onMinimize}
          >
            <Minus className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 hover:bg-green-500/20"
            onClick={onMaximize}
          >
            <Maximize className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 hover:bg-red-500/20"
            onClick={onClose}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* App content */}
      <div className="h-[calc(100%-2rem)] overflow-auto">
        {renderAppContent()}
      </div>
    </div>
  );
};