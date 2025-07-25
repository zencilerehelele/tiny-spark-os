import React from "react";
import { LucideIcon } from "lucide-react";
import { useState, useRef } from "react";

interface DesktopIconProps {
  name: string;
  icon: LucideIcon;
  onDoubleClick: () => void;
  position?: { x: number; y: number };
  onPositionChange?: (position: { x: number; y: number }) => void;
}

export const DesktopIcon = ({ 
  name, 
  icon: Icon, 
  onDoubleClick, 
  position = { x: 0, y: 0 }, 
  onPositionChange 
}: DesktopIconProps) => {
  const [isSelected, setIsSelected] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const iconRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.detail === 1) { // Single click
      setIsSelected(!isSelected);
      setIsDragging(true);
      const rect = iconRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && onPositionChange) {
      const newPosition = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      };
      onPositionChange(newPosition);
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
  }, [isDragging, dragOffset]);

  return (
    <div
      ref={iconRef}
      className={`
        flex flex-col items-center justify-center p-2 rounded cursor-pointer
        w-20 h-20 transition-colors duration-200 absolute select-none
        ${isSelected ? 'bg-os-primary/20 border border-os-primary/50' : 'hover:bg-white/10'}
        ${isDragging ? 'z-50' : 'z-10'}
      `}
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
      onDoubleClick={onDoubleClick}
    >
      <Icon className="w-8 h-8 text-foreground mb-1" />
      <span className="text-xs text-foreground text-center leading-tight">
        {name}
      </span>
    </div>
  );
};