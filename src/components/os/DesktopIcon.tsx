import { LucideIcon } from "lucide-react";
import { useState } from "react";

interface DesktopIconProps {
  name: string;
  icon: LucideIcon;
  onDoubleClick: () => void;
}

export const DesktopIcon = ({ name, icon: Icon, onDoubleClick }: DesktopIconProps) => {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <div
      className={`
        flex flex-col items-center justify-center p-2 rounded cursor-pointer
        w-20 h-20 transition-colors duration-200
        ${isSelected ? 'bg-os-primary/20 border border-os-primary/50' : 'hover:bg-white/10'}
      `}
      onClick={() => setIsSelected(!isSelected)}
      onDoubleClick={onDoubleClick}
    >
      <Icon className="w-8 h-8 text-foreground mb-1" />
      <span className="text-xs text-foreground text-center leading-tight">
        {name}
      </span>
    </div>
  );
};